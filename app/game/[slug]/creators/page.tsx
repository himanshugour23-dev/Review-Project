"use client";
import { use, useEffect, useState } from "react";
import Link from "next/link";

interface Company {
  id: number;
  name: string;
  slug?: string;
}

interface DevelopmentTeam {
  developers: Company[];
  publishers: Company[];
}

interface CompanyLogo {
  id?: number;
  image_id?: string;
  url?: string;
}

interface RelatedGame {
  id: number;
  name: string;
  slug?: string;
}

interface CompanyDetails {
  id: number;
  name: string;
  slug?: string;
  description?: string;
  url?: string;
  logo?: CompanyLogo | string | null;
  developed?: RelatedGame[];
  published?: RelatedGame[];
}

type Artwork =
  | string
  | {
      id?: number;
      image_id?: string;
      url?: string;
      width?: number;
      height?: number;
    };

interface CreatorResponse {
  game: {
    name: string;
    slug: string;
    igdbId: number;
  };

  creators: DevelopmentTeam;

  companyDetails: CompanyDetails[];

  artworks: Artwork[];

  isPremium: boolean;
}

type IGDBImageSize =
  | "t_thumb"
  | "t_logo_med"
  | "t_cover_big"
  | "t_1080p";

function getIGDBImage(
  input?: string | null,
  size: IGDBImageSize = "t_1080p"
): string | null {
  if (!input || typeof input !== "string") {
    return null;
  }

  let value = input.trim();

  if (!value) return null;

  value = value.replace(/\/+$/, "");

  if (/^https?:\/\//i.test(value)) {
    try {
      const url = new URL(value);

      // Do not rewrite URLs from unrelated hosts.
      if (url.hostname !== "images.igdb.com") {
        return value;
      }

      // Replace IGDB's image-size segment.
      url.pathname = url.pathname.replace(
        /\/t_[^/]+\//,
        `/${size}/`
      );

      return url.toString().replace(/\/+$/, "");
    } catch {
      return value;
    }
  }

  // Relative IGDB image path or image ID.
  const normalized = value
    .replace(/^\/+/, "")
    .replace(/^igdb\/image\/upload\//, "")
    .replace(
      /^images\.igdb\.com\/igdb\/image\/upload\//,
      ""
    )
    .replace(/^t_[^/]+\//, "")
    .replace(/\.jpg$/i, "");

  if (!normalized) return null;

  return `https://images.igdb.com/igdb/image/upload/${size}/${normalized}.jpg`;
}

function getArtworkImage(artwork: Artwork): string | null {
  // Your current MongoDB artwork format is string[].
  if (typeof artwork === "string") {
    return getIGDBImage(artwork, "t_1080p");
  }

  // Also support object format.
  return getIGDBImage(
    artwork.image_id || artwork.url,
    "t_1080p"
  );
}

function getCompanyLogo(
  company: CompanyDetails
): string | null {
  const logo = company.logo;

  if (!logo) return null;

  if (typeof logo === "string") {
    return getIGDBImage(logo, "t_logo_med");
  }

  return getIGDBImage(
    logo.image_id || logo.url,
    "t_logo_med"
  );
}

function CompanyCard({
  company,
  details,
  type,
}: {
  company: Company;
  details?: CompanyDetails;
  type: "Developer" | "Publisher";
}) {
  const [expanded, setExpanded] = useState(false);
  const [logoFailed, setLogoFailed] = useState(false);

  const description = details?.description?.trim();

  const logo =
    details && !logoFailed
      ? getCompanyLogo(details)
      : null;

  const relatedGames =
    type === "Developer"
      ? details?.developed ?? []
      : details?.published ?? [];

  return (
    <article className="group overflow-hidden rounded-2xl border border-gray-800 bg-gray-900/90 transition duration-300 hover:border-lime-300/40 hover:bg-gray-900">
      <div className="relative h-36 overflow-hidden bg-gradient-to-br from-gray-800 via-gray-900 to-black">

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(217,255,112,0.12),transparent_55%)]" />

        <div className="absolute right-5 top-5">
          <span className="rounded-full border border-gray-700 bg-black/40 px-3 py-1 text-xs text-gray-300">
            {type}
          </span>
        </div>

        {/* Company logo */}
        <div className="absolute bottom-5 left-6 flex h-16 w-16 items-center justify-center overflow-hidden rounded-xl border border-gray-700 bg-gray-950 shadow-xl">

          {logo ? (
            <img
              src={logo}
              alt={`${company.name} logo`}
              className="h-full w-full object-contain p-2"
              loading="lazy"
              onError={() => setLogoFailed(true)}
            />
          ) : (
            <span className="text-2xl font-bold text-lime-300">
              {company.name.charAt(0).toUpperCase()}
            </span>
          )}

        </div>
      </div>

      {/* Company information */}
      <div className="px-6 pb-6 pt-6">

        <h2 className="text-xl font-bold text-white">
          {company.name}
        </h2>

        {company.slug && (
          <p className="mt-1 text-xs text-gray-500">
            {company.slug}
          </p>
        )}

        {/* Description */}
        {description && (
          <div className="mt-5">

            <h3 className="mb-2 text-sm font-semibold text-gray-200">
              About
            </h3>

            <p
              className={`whitespace-pre-line text-sm leading-6 text-gray-400 ${
                expanded ? "" : "line-clamp-5"
              }`}
            >
              {description}
            </p>

            {description.length > 250 && (
              <button
                type="button"
                onClick={() =>
                  setExpanded((previous) => !previous)
                }
                className="mt-2 text-xs font-semibold text-lime-300 transition hover:text-lime-200"
              >
                {expanded ? "Show less" : "Read more"}
              </button>
            )}

          </div>
        )}
        {relatedGames.length > 0 && (
          <div className="mt-6 border-t border-gray-800 pt-5">

            <div className="mb-3 flex items-center justify-between">

              <h3 className="text-sm font-semibold text-gray-200">
                {type === "Developer"
                  ? "Developed games"
                  : "Published games"}
              </h3>

              <span className="rounded-full bg-gray-800 px-2.5 py-1 text-xs text-gray-400">
                {relatedGames.length}
              </span>

            </div>

            <div className="flex flex-wrap gap-2">

              {relatedGames.slice(0, 8).map((game) => (
                <span
                  key={game.id}
                  className="rounded-lg border border-gray-800 bg-gray-950 px-3 py-2 text-xs text-gray-400"
                >
                  {game.name}
                </span>
              ))}

            </div>
          </div>
        )}

        {details?.url && (
          <a
            href={details.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-lime-300 transition hover:text-lime-200"
          >
            Official website
            <span aria-hidden="true">↗</span>
          </a>
        )}

      </div>
    </article>
  );
}


export default function CreatorsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);

  const [data, setData] =
    useState<CreatorResponse | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function loadCreators() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `/api/games/${encodeURIComponent(slug)}/creators`,
          {
            signal: controller.signal,
            cache: "no-store",
          }
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result.message ||
              "Failed to load premium information"
          );
        }

        setData(result);
      } catch (error) {
        if (
          error instanceof Error &&
          error.name === "AbortError"
        ) {
          return;
        }

        console.error("Creators page error:", error);

        setError(
          error instanceof Error
            ? error.message
            : "Something went wrong"
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadCreators();

    return () => controller.abort();
  }, [slug]);


  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#09090b] px-5 text-white">

        <div className="text-center">

          <div className="mx-auto mb-5 h-10 w-10 animate-spin rounded-full border-2 border-gray-700 border-t-lime-300" />

          <h2 className="text-xl font-semibold">
            Loading development team...
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            Fetching developers, publishers and company information
          </p>

        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#09090b] px-5 text-white">

        <div className="max-w-md text-center">

          <h2 className="text-2xl font-bold">
            Unable to load premium content
          </h2>

          <p className="mt-3 text-sm text-red-400">
            {error}
          </p>

          <Link
            href="/"
            className="mt-6 inline-block rounded-lg bg-gray-800 px-5 py-3 text-sm transition hover:bg-gray-700"
          >
            Go back
          </Link>

        </div>
      </main>
    );
  }

  if (!data) return null;


  const developers = data.creators?.developers ?? [];
  const publishers = data.creators?.publishers ?? [];
  const companyDetails = data.companyDetails ?? [];
  const artworks = data.artworks ?? [];

  const getDetails = (id: number) =>
    companyDetails.find((company) => company.id === id);

  const totalCompanies =
    developers.length + publishers.length;


  return (
    <main className="min-h-screen overflow-hidden bg-[#09090b] px-5 py-10 text-white sm:px-8">

      <div className="mx-auto max-w-6xl">

        <Link
          href={`/game/${data.game.slug}`}
          className="inline-flex items-center gap-2 text-sm text-gray-500 transition hover:text-lime-300"
        >
          <span aria-hidden="true">←</span>
          Back to {data.game.name}
        </Link>

        <header className="mb-12 mt-10">

          <div className="mb-4 flex flex-wrap items-center gap-3">

            <span className="rounded-full border border-lime-300/20 bg-lime-300/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-lime-300">
              Premium
            </span>

            <span className="text-xs uppercase tracking-widest text-gray-600">
              IGDB game intelligence
            </span>

          </div>

          <h1 className="text-3xl font-bold tracking-tight sm:text-5xl">
            The people behind{" "}
            <span className="text-lime-300">
              {data.game.name}
            </span>
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-gray-400 sm:text-base">
            Explore the studios responsible for developing and
            publishing this game, discover their company information,
            and browse premium artwork.
          </p>

        </header>

        <section className="mb-16">

          <div className="mb-7 flex flex-wrap items-end justify-between gap-3">

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-lime-300">
                Behind the game
              </p>

              <h2 className="mt-2 text-2xl font-bold sm:text-3xl">
                Development team
              </h2>
            </div>

            <p className="text-sm text-gray-500">
              {totalCompanies} companies
            </p>

          </div>

          {totalCompanies === 0 ? (
            <div className="rounded-2xl border border-gray-800 bg-gray-900/50 px-6 py-16 text-center">
              <p className="text-gray-400">
                No development team information is available for this game.
              </p>
            </div>
          ) : (
            <div className="space-y-12">

              {developers.length > 0 && (
                <div>

                  <h3 className="mb-5 flex items-center gap-3 text-lg font-semibold">

                    <span className="h-6 w-1 rounded-full bg-lime-300" />

                    Developers

                    <span className="text-sm font-normal text-gray-500">
                      ({developers.length})
                    </span>

                  </h3>

                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

                    {developers.map((company) => (
                      <CompanyCard
                        key={company.id}
                        company={company}
                        details={getDetails(company.id)}
                        type="Developer"
                      />
                    ))}

                  </div>
                </div>
              )}

              {publishers.length > 0 && (
                <div>

                  <h3 className="mb-5 flex items-center gap-3 text-lg font-semibold">

                    <span className="h-6 w-1 rounded-full bg-indigo-400" />

                    Publishers

                    <span className="text-sm font-normal text-gray-500">
                      ({publishers.length})
                    </span>

                  </h3>

                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

                    {publishers.map((company) => (
                      <CompanyCard
                        key={company.id}
                        company={company}
                        details={getDetails(company.id)}
                        type="Publisher"
                      />
                    ))}

                  </div>
                </div>
              )}

            </div>
          )}

        </section>

        <section className="mb-16">

          <div className="mb-7">

            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-lime-300">
              Visual collection
            </p>

            <h2 className="mt-2 text-2xl font-bold sm:text-3xl">
              Game artworks
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Premium artwork collection for {data.game.name}
            </p>

          </div>

          {artworks.length === 0 ? (
            <div className="rounded-2xl border border-gray-800 bg-gray-900/50 px-6 py-12 text-center">
              <p className="text-gray-400">
                No additional artworks are available for this game.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">

              {artworks.map((artwork, index) => {
                const image = getArtworkImage(artwork);

                if (!image) return null;

                const key =
                  typeof artwork === "string"
                    ? artwork
                    : artwork.id ?? `${image}-${index}`;

                return (
                  <a
                    key={key}
                    href={image}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative aspect-video overflow-hidden rounded-xl border border-gray-800 bg-gray-900"
                  >
                    <img
                      src={image}
                      alt={`${data.game.name} artwork ${index + 1}`}
                      loading="lazy"
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      onError={(event) => {
                        event.currentTarget.style.display = "none";
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-70 transition group-hover:opacity-100" />

                    <span className="absolute bottom-4 left-4 text-xs font-medium text-white">
                      Artwork {index + 1}
                    </span>

                  </a>
                );
              })}

            </div>
          )}

        </section>
        <footer className="border-t border-gray-800 pt-7 text-center">
          <p className="text-xs text-gray-600">
            Game information powered by IGDB
          </p>

        </footer>

      </div>
    </main>
  );
}
