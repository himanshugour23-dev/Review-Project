"use client";

import { useMemo, useState } from "react";
import { Filter, Layers, Move, ZoomIn, ZoomOut } from "lucide-react";

type Layer = "browser" | "server" | "services" | "database" | "async";
type Domain =
  | "shell"
  | "discovery"
  | "community"
  | "identity"
  | "payments"
  | "moderation";
type FlowType = "sync" | "async";

interface DiagramNode {
  id: string;
  label: string;
  layer: Layer;
  domain: Domain;
  x: number;
  y: number;
  description: string;
  files: string[];
}

interface DiagramEdge {
  id: string;
  source: string;
  target: string;
  label: string;
  type: FlowType;
}

const layerLabels: Record<Layer, string> = {
  browser: "Browser / UI",
  server: "Next.js Server (App Router API)",
  services: "Services & Integrations",
  database: "MongoDB / Mongoose",
  async: "Async / Webhook",
};

const layerColors: Record<Layer, string> = {
  browser: "#86efac",
  server: "#93c5fd",
  services: "#f9a8d4",
  database: "#fcd34d",
  async: "#a5b4fc",
};

const domainLabels: Record<Domain, string> = {
  shell: "UI shell",
  discovery: "Game discovery",
  community: "Reviews & moderation",
  identity: "Identity & profile",
  payments: "Payments",
  moderation: "Avatar safety",
};

const nodes: DiagramNode[] = [
  {
    id: "app-shell",
    label: "AppShell + Providers",
    layer: "browser",
    domain: "shell",
    x: 260,
    y: 170,
    description:
      "Global client shell mounting Navbar, SessionProvider/UserProvider, transitions and toaster.",
    files: ["app/layout.tsx", "app/AppShell.tsx", "app/providers.tsx", "app/providers/UserProvider.tsx"],
  },
  {
    id: "ui-pages",
    label: "App Router pages",
    layer: "browser",
    domain: "discovery",
    x: 600,
    y: 170,
    description:
      "Main pages: /, /browse, /discover, /game/[slug], /user/*, /admin/*, /checkoutPageDetails.",
    files: ["app/page.tsx", "app/browse/page.tsx", "app/discover/page.tsx", "app/game/[slug]/page.tsx", "app/user/me/page.tsx", "app/admin/reports/page.tsx"],
  },
  {
    id: "api-games",
    label: "Games API group",
    layer: "server",
    domain: "discovery",
    x: 540,
    y: 410,
    description:
      "Search/browse/discover/game detail routes with RAWG fetch + Mongo cache and premium enrichments.",
    files: ["app/api/games/search/route.ts", "app/api/games/browse/route.ts", "app/api/games/discover/route.ts", "app/api/games/[slug]/route.ts", "app/api/games/[slug]/creators/route.ts"],
  },
  {
    id: "api-community",
    label: "Reviews / Reactions / Reports",
    layer: "server",
    domain: "community",
    x: 880,
    y: 410,
    description:
      "Review upsert + rating aggregates, reaction toggles, report creation, and admin moderation decisions.",
    files: ["app/api/reviews/route.ts", "app/api/reactions/route.ts", "app/api/reports/route.ts", "app/api/admin/reports/route.ts", "app/api/admin/reports/[id]/route.ts"],
  },
  {
    id: "api-identity",
    label: "Auth + User APIs",
    layer: "server",
    domain: "identity",
    x: 220,
    y: 410,
    description:
      "NextAuth endpoint, profile endpoints, favourites, avatar update endpoint, and route protection.",
    files: ["app/api/auth/[...nextauth]/route.ts", "lib/auth.ts", "proxy.ts", "app/api/user/me/route.ts", "app/api/user/me/favourite/add/route.ts", "app/api/user/me/favourite/remove/route.ts", "app/api/user/me/avatar/route.ts"],
  },
  {
    id: "api-payment",
    label: "Payment API",
    layer: "server",
    domain: "payments",
    x: 1220,
    y: 410,
    description:
      "Razorpay order creation, callback signature verification, payment persistence, premium activation.",
    files: ["app/api/payment/create-order/route.ts", "app/api/payment/callback/route.ts", "app/api/checkout/route.ts", "components/RazorpayCheckoutButton.tsx"],
  },
  {
    id: "rawg-service",
    label: "RAWG client",
    layer: "services",
    domain: "discovery",
    x: 520,
    y: 630,
    description:
      "External RAWG API adapter used for search, game details, DLC, and creators endpoints.",
    files: ["lib/rawg.ts", "lib/creators.ts"],
  },
  {
    id: "avatar-services",
    label: "Gemini + Cloudinary",
    layer: "services",
    domain: "moderation",
    x: 840,
    y: 630,
    description:
      "Two-stage avatar moderation: Gemini pre-check then Cloudinary aws_rek moderation.",
    files: ["lib/avatarModration.ts", "lib/cloudinary.ts", "app/api/user/me/avatar/route.ts"],
  },
  {
    id: "razorpay-service",
    label: "Razorpay Gateway",
    layer: "services",
    domain: "payments",
    x: 1220,
    y: 630,
    description:
      "External gateway that returns payment callback payload to callback route.",
    files: ["app/api/payment/create-order/route.ts", "app/api/payment/callback/route.ts"],
  },
  {
    id: "models-game-review",
    label: "Game/Review Models + indexes",
    layer: "database",
    domain: "community",
    x: 740,
    y: 870,
    description:
      "Game cache + review records with indexes for uniqueness and ranking fields.",
    files: ["models/game.ts", "models/review.ts", "models/reviewReaction.ts", "lib/db.ts"],
  },
  {
    id: "models-identity",
    label: "User/Report/Payment Models",
    layer: "database",
    domain: "identity",
    x: 1080,
    y: 870,
    description:
      "User identity/subscription state, report uniqueness, payment status tracking.",
    files: ["models/User.ts", "models/report.ts", "models/payment.ts", "lib/db.ts"],
  },
  {
    id: "async-webhooks",
    label: "Webhook callbacks",
    layer: "async",
    domain: "moderation",
    x: 1000,
    y: 1060,
    description:
      "Cloudinary moderation webhook + Razorpay callback are asynchronous return paths.",
    files: ["app/api/cloudinary-webhook/route.ts", "app/api/payment/callback/route.ts"],
  },
];

const edges: DiagramEdge[] = [
  { id: "e1", source: "app-shell", target: "ui-pages", label: "shared shell", type: "sync" },
  { id: "e2", source: "ui-pages", target: "api-games", label: "fetch game data", type: "sync" },
  { id: "e3", source: "ui-pages", target: "api-community", label: "reviews/reports/reactions", type: "sync" },
  { id: "e4", source: "ui-pages", target: "api-identity", label: "session/profile/avatar", type: "sync" },
  { id: "e5", source: "ui-pages", target: "api-payment", label: "checkout/order", type: "sync" },
  { id: "e6", source: "api-games", target: "rawg-service", label: "RAWG calls", type: "sync" },
  { id: "e7", source: "api-games", target: "models-game-review", label: "cache+read/write", type: "sync" },
  { id: "e8", source: "api-community", target: "models-game-review", label: "review/reaction/report writes", type: "sync" },
  { id: "e9", source: "api-community", target: "models-identity", label: "report metadata", type: "sync" },
  { id: "e10", source: "api-identity", target: "models-identity", label: "auth/profile state", type: "sync" },
  { id: "e11", source: "api-identity", target: "avatar-services", label: "moderate + upload avatar", type: "sync" },
  { id: "e12", source: "api-payment", target: "razorpay-service", label: "create order", type: "sync" },
  { id: "e13", source: "api-payment", target: "models-identity", label: "payment + premium grant", type: "sync" },
  { id: "e14", source: "avatar-services", target: "async-webhooks", label: "Cloudinary moderation event", type: "async" },
  { id: "e15", source: "razorpay-service", target: "async-webhooks", label: "payment callback", type: "async" },
  { id: "e16", source: "async-webhooks", target: "models-identity", label: "clear avatar / confirm payment", type: "async" },
];

function edgePath(source: DiagramNode, target: DiagramNode) {
  const dx = target.x - source.x;
  const curve = Math.max(80, Math.min(220, Math.abs(dx) * 0.45));
  const c1x = source.x + (dx >= 0 ? curve : -curve);
  const c2x = target.x - (dx >= 0 ? curve : -curve);
  return `M ${source.x} ${source.y} C ${c1x} ${source.y}, ${c2x} ${target.y}, ${target.x} ${target.y}`;
}

export default function ArchitectureDiagram() {
  const [activeLayers, setActiveLayers] = useState<Layer[]>(Object.keys(layerLabels) as Layer[]);
  const [activeDomains, setActiveDomains] = useState<Domain[]>(Object.keys(domainLabels) as Domain[]);
  const [selectedNodeId, setSelectedNodeId] = useState<string>(nodes[0].id);
  const [scale, setScale] = useState(0.75);
  const [offset, setOffset] = useState({ x: -70, y: -20 });
  const [panning, setPanning] = useState(false);
  const [lastPoint, setLastPoint] = useState({ x: 0, y: 0 });

  const nodeMap = useMemo(() => new Map(nodes.map((node) => [node.id, node])), []);

  const visibleNodes = useMemo(
    () =>
      nodes.filter(
        (node) =>
          activeLayers.includes(node.layer) &&
          activeDomains.includes(node.domain)
      ),
    [activeDomains, activeLayers]
  );

  const visibleNodeIds = useMemo(
    () => new Set(visibleNodes.map((node) => node.id)),
    [visibleNodes]
  );

  const visibleEdges = useMemo(
    () =>
      edges.filter(
        (edge) =>
          visibleNodeIds.has(edge.source) && visibleNodeIds.has(edge.target)
      ),
    [visibleNodeIds]
  );

  const selectedNode = visibleNodes.find((node) => node.id === selectedNodeId) ?? visibleNodes[0] ?? nodes[0];

  const selectedConnections = useMemo(() => {
    return visibleEdges.filter(
      (edge) => edge.source === selectedNode.id || edge.target === selectedNode.id
    );
  }, [selectedNode.id, visibleEdges]);

  const toggleLayer = (layer: Layer) => {
    setActiveLayers((prev) =>
      prev.includes(layer) ? prev.filter((value) => value !== layer) : [...prev, layer]
    );
  };

  const toggleDomain = (domain: Domain) => {
    setActiveDomains((prev) =>
      prev.includes(domain)
        ? prev.filter((value) => value !== domain)
        : [...prev, domain]
    );
  };

  const clampScale = (next: number) => Math.max(0.55, Math.min(1.9, next));

  return (
    <div className="space-y-5">
      <div className="rounded-3xl border border-white/10 bg-black/35 p-4">
        <div className="mb-4 flex flex-wrap items-center gap-2 text-xs text-zinc-300">
          <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-3 py-1 font-semibold text-zinc-100">
            <Layers size={14} /> Layers
          </span>
          {(Object.keys(layerLabels) as Layer[]).map((layer) => (
            <button
              key={layer}
              onClick={() => toggleLayer(layer)}
              className={`rounded-full border px-3 py-1 transition ${
                activeLayers.includes(layer)
                  ? "border-white/20 bg-white/15 text-white"
                  : "border-white/10 bg-transparent text-zinc-500"
              }`}
            >
              {layerLabels[layer]}
            </button>
          ))}
        </div>

        <div className="mb-5 flex flex-wrap items-center gap-2 text-xs text-zinc-300">
          <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-3 py-1 font-semibold text-zinc-100">
            <Filter size={14} /> Domains
          </span>
          {(Object.keys(domainLabels) as Domain[]).map((domain) => (
            <button
              key={domain}
              onClick={() => toggleDomain(domain)}
              className={`rounded-full border px-3 py-1 transition ${
                activeDomains.includes(domain)
                  ? "border-white/20 bg-white/15 text-white"
                  : "border-white/10 bg-transparent text-zinc-500"
              }`}
            >
              {domainLabels[domain]}
            </button>
          ))}
        </div>

        <div className="mb-3 flex items-center justify-between text-[11px] uppercase tracking-[0.18em] text-zinc-500">
          <span className="inline-flex items-center gap-1">
            <Move size={12} /> drag to pan • wheel/buttons to zoom
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setScale((prev) => clampScale(prev - 0.1))}
              className="rounded-lg border border-white/10 bg-white/5 p-1.5 text-zinc-300 transition hover:bg-white/10"
              aria-label="Zoom out"
            >
              <ZoomOut size={14} />
            </button>
            <button
              onClick={() => setScale((prev) => clampScale(prev + 0.1))}
              className="rounded-lg border border-white/10 bg-white/5 p-1.5 text-zinc-300 transition hover:bg-white/10"
              aria-label="Zoom in"
            >
              <ZoomIn size={14} />
            </button>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#08090c]">
          <svg
            viewBox="0 0 1500 1180"
            className="h-[56vh] min-h-[420px] w-full touch-none"
            onWheel={(event) => {
              event.preventDefault();
              const svgRect = event.currentTarget.getBoundingClientRect();
              const cursorX = event.clientX - svgRect.left;
              const cursorY = event.clientY - svgRect.top;
              const zoomDirection = event.deltaY > 0 ? -0.08 : 0.08;
              const nextScale = clampScale(scale + zoomDirection);

              const worldX = (cursorX - offset.x) / scale;
              const worldY = (cursorY - offset.y) / scale;

              setOffset({
                x: cursorX - worldX * nextScale,
                y: cursorY - worldY * nextScale,
              });
              setScale(nextScale);
            }}
            onPointerDown={(event) => {
              const target = event.target as SVGElement;
              if (target.closest("[data-node='true']")) return;
              setPanning(true);
              setLastPoint({ x: event.clientX, y: event.clientY });
              event.currentTarget.setPointerCapture(event.pointerId);
            }}
            onPointerMove={(event) => {
              if (!panning) return;
              const deltaX = event.clientX - lastPoint.x;
              const deltaY = event.clientY - lastPoint.y;
              setOffset((prev) => ({ x: prev.x + deltaX, y: prev.y + deltaY }));
              setLastPoint({ x: event.clientX, y: event.clientY });
            }}
            onPointerUp={(event) => {
              setPanning(false);
              if (event.currentTarget.hasPointerCapture(event.pointerId)) {
                event.currentTarget.releasePointerCapture(event.pointerId);
              }
            }}
          >
            <defs>
              <marker id="arrow-sync" markerWidth="9" markerHeight="9" refX="8" refY="4.5" orient="auto">
                <path d="M0,0 L9,4.5 L0,9 z" fill="#93c5fd" />
              </marker>
              <marker id="arrow-async" markerWidth="9" markerHeight="9" refX="8" refY="4.5" orient="auto">
                <path d="M0,0 L9,4.5 L0,9 z" fill="#a5b4fc" />
              </marker>
            </defs>

            <g transform={`translate(${offset.x} ${offset.y}) scale(${scale})`}>
              {(["browser", "server", "services", "database", "async"] as Layer[]).map((layer, index) => (
                <g key={layer}>
                  <rect
                    x={30}
                    y={70 + index * 220}
                    width={1440}
                    height={180}
                    rx={16}
                    fill={`${layerColors[layer]}12`}
                    stroke={`${layerColors[layer]}55`}
                  />
                  <text
                    x={50}
                    y={100 + index * 220}
                    fill={layerColors[layer]}
                    fontSize={16}
                    fontWeight={700}
                  >
                    {layerLabels[layer]}
                  </text>
                </g>
              ))}

              {visibleEdges.map((edge) => {
                const source = nodeMap.get(edge.source);
                const target = nodeMap.get(edge.target);
                if (!source || !target) return null;

                const highlighted =
                  selectedNode.id === edge.source || selectedNode.id === edge.target;
                const strokeColor = edge.type === "async" ? "#a5b4fc" : "#93c5fd";

                return (
                  <g key={edge.id}>
                    <path
                      d={edgePath(source, target)}
                      fill="none"
                      stroke={strokeColor}
                      strokeWidth={highlighted ? 2.8 : 1.8}
                      strokeOpacity={highlighted ? 0.95 : 0.5}
                      strokeDasharray={edge.type === "async" ? "7 6" : "0"}
                      markerEnd={edge.type === "async" ? "url(#arrow-async)" : "url(#arrow-sync)"}
                    />
                    <text
                      x={(source.x + target.x) / 2}
                      y={(source.y + target.y) / 2 - 8}
                      textAnchor="middle"
                      fill="#cbd5e1"
                      fontSize={11}
                    >
                      {edge.label}
                    </text>
                  </g>
                );
              })}

              {visibleNodes.map((node) => {
                const isSelected = selectedNode.id === node.id;
                return (
                  <g
                    key={node.id}
                    data-node="true"
                    onClick={() => setSelectedNodeId(node.id)}
                    style={{ cursor: "pointer" }}
                  >
                    <rect
                      x={node.x - 135}
                      y={node.y - 44}
                      width={270}
                      height={88}
                      rx={14}
                      fill={isSelected ? "#111827" : "#0f172a"}
                      stroke={layerColors[node.layer]}
                      strokeWidth={isSelected ? 2.4 : 1.3}
                      opacity={isSelected ? 1 : 0.92}
                    />
                    <text
                      x={node.x}
                      y={node.y - 5}
                      textAnchor="middle"
                      fill="#f8fafc"
                      fontSize={15}
                      fontWeight={700}
                    >
                      {node.label}
                    </text>
                    <text
                      x={node.x}
                      y={node.y + 17}
                      textAnchor="middle"
                      fill="#94a3b8"
                      fontSize={11}
                    >
                      {domainLabels[node.domain]}
                    </text>
                  </g>
                );
              })}
            </g>
          </svg>
        </div>

        <div className="mt-4 grid gap-2 text-xs text-zinc-300 sm:grid-cols-2 lg:grid-cols-4">
          {(Object.keys(layerLabels) as Layer[]).map((layer) => (
            <div key={layer} className="rounded-xl border border-white/10 bg-white/5 px-3 py-2">
              <div className="flex items-center gap-2 font-semibold text-zinc-100">
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: layerColors[layer] }} />
                {layerLabels[layer]}
              </div>
            </div>
          ))}
          <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2">
            <div className="font-semibold text-zinc-100">Flow type</div>
            <p className="mt-1 text-zinc-400">Solid = synchronous request/response • Dashed = async callback/webhook</p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.1fr_1fr]">
        <section className="rounded-2xl border border-white/10 bg-black/25 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-lime-300">Selected node details</p>
          <h2 className="mt-2 text-2xl font-bold text-white">{selectedNode.label}</h2>
          <p className="mt-2 text-sm leading-6 text-zinc-300">{selectedNode.description}</p>
          <div className="mt-3 flex flex-wrap gap-2 text-xs">
            <span className="rounded-full border border-white/15 bg-white/5 px-2.5 py-1 text-zinc-200">Layer: {layerLabels[selectedNode.layer]}</span>
            <span className="rounded-full border border-white/15 bg-white/5 px-2.5 py-1 text-zinc-200">Domain: {domainLabels[selectedNode.domain]}</span>
          </div>
          <div className="mt-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400">Concrete files</p>
            <ul className="mt-2 space-y-1 text-sm text-zinc-300">
              {selectedNode.files.map((file) => (
                <li key={file} className="rounded-lg border border-white/5 bg-white/[0.03] px-2.5 py-1.5 font-mono text-xs text-zinc-300">
                  {file}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="rounded-2xl border border-white/10 bg-black/25 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-lime-300">Connected flows</p>
          <ul className="mt-3 space-y-2 text-sm text-zinc-300">
            {selectedConnections.length === 0 ? (
              <li className="rounded-lg border border-white/5 bg-white/[0.03] px-3 py-2 text-zinc-400">
                No visible connections with current filters.
              </li>
            ) : (
              selectedConnections.map((edge) => {
                const source = nodeMap.get(edge.source);
                const target = nodeMap.get(edge.target);
                if (!source || !target) return null;
                return (
                  <li key={edge.id} className="rounded-lg border border-white/5 bg-white/[0.03] px-3 py-2">
                    <p className="font-medium text-zinc-100">
                      {source.label} → {target.label}
                    </p>
                    <p className="mt-1 text-xs text-zinc-400">
                      {edge.label} ({edge.type === "async" ? "asynchronous" : "synchronous"})
                    </p>
                  </li>
                );
              })
            )}
          </ul>
        </section>
      </div>

      <section className="rounded-2xl border border-white/10 bg-black/25 p-4 text-sm text-zinc-300">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-lime-300">Implementation notes from code review</p>
        <ul className="mt-3 list-disc space-y-2 pl-5 leading-6">
          <li><strong>README/payment mismatch:</strong> checkout UI advertises ₹0 test purchase, while <code>app/api/payment/create-order/route.ts</code> creates a ₹99 order.</li>
          <li><strong>Subscription route mismatch:</strong> <code>components/RazorpaySubscriptionButton.tsx</code> references <code>/api/subscription/*</code> routes that are not implemented.</li>
          <li><strong>Failure page copy mismatch:</strong> <code>app/payment/failed/page.tsx</code> says signature verification was successful on a failure path.</li>
        </ul>
      </section>
    </div>
  );
}
