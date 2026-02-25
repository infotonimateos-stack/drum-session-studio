import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Activity, Clock, Eye, TrendingUp, UserPlus, RefreshCw, BarChart3, Brain, Loader2 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from "recharts";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";

interface AnalyticsData {
  configured: boolean;
  overview?: {
    totalUsers: number;
    sessions: number;
    avgSessionDuration: number;
    pageViews: number;
    bounceRate: number;
    newUsers: number;
  };
  sources?: { channel: string; sessions: number }[];
  topPages?: { path: string; views: number }[];
  referrals?: { source: string; sessions: number }[];
  period?: number;
}

interface FunnelStep {
  step_number: number;
  step_name: string;
  step_label: string;
  users: number;
  dropoff_pct: number;
  retention_pct: number;
  cumulative_dropoff_pct: number;
}

const CHANNEL_COLORS: Record<string, string> = {
  "Organic Search": "hsl(142, 71%, 45%)",
  "Direct": "hsl(217, 91%, 60%)",
  "Organic Social": "hsl(330, 81%, 60%)",
  "Referral": "hsl(38, 92%, 50%)",
  "Paid Search": "hsl(262, 83%, 58%)",
  "Email": "hsl(0, 84%, 60%)",
  "Display": "hsl(180, 70%, 45%)",
  "Paid Social": "hsl(280, 70%, 55%)",
};

const getChannelColor = (channel: string, idx: number) =>
  CHANNEL_COLORS[channel] || `hsl(${(idx * 47) % 360}, 60%, 55%)`;

const formatDuration = (seconds: number) => {
  const m = Math.floor(seconds / 60);
  const s = Math.round(seconds % 60);
  return `${m}m ${s}s`;
};

interface Props {
  storedPassword: string;
}

export default function AnalyticsTab({ storedPassword }: Props) {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [period, setPeriod] = useState("30");
  const [error, setError] = useState<string | null>(null);

  // Funnel state
  const [funnel, setFunnel] = useState<FunnelStep[]>([]);
  const [funnelLoading, setFunnelLoading] = useState(false);

  // AI analysis state
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [analysisLoading, setAnalysisLoading] = useState(false);

  const headers = {
    "x-admin-password": storedPassword,
    "apikey": import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
    "Content-Type": "application/json",
  };

  const fetchAnalytics = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const url = new URL(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/analytics-ga`);
      url.searchParams.set("period", period);
      const res = await fetch(url.toString(), { headers });
      if (!res.ok) throw new Error("Error fetching analytics");
      const json = await res.json();
      setData(json);
    } catch (e: any) {
      setError(e.message);
    }
    setLoading(false);
  }, [storedPassword, period]);

  const fetchFunnel = useCallback(async () => {
    setFunnelLoading(true);
    try {
      const url = new URL(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/analytics-funnel`);
      url.searchParams.set("period", period);
      const res = await fetch(url.toString(), { headers });
      if (!res.ok) throw new Error("Error fetching funnel");
      const json = await res.json();
      if (json.funnel) setFunnel(json.funnel);
    } catch (e: any) {
      console.error("Funnel error:", e);
    }
    setFunnelLoading(false);
  }, [storedPassword, period]);

  const fetchAll = useCallback(() => {
    setAnalysis(null);
    fetchAnalytics();
    fetchFunnel();
  }, [fetchAnalytics, fetchFunnel]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const handleAnalyze = async () => {
    if (funnel.length === 0) {
      toast.error("No hay datos de embudo para analizar");
      return;
    }
    setAnalysisLoading(true);
    setAnalysis(null);
    try {
      const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/analyze-funnel`, {
        method: "POST",
        headers,
        body: JSON.stringify({ funnel }),
      });
      if (!res.ok) {
        const err = await res.json();
        toast.error(err.error || "Error al analizar");
        setAnalysisLoading(false);
        return;
      }
      const json = await res.json();
      setAnalysis(json.analysis);
    } catch (e: any) {
      toast.error("Error de conexión con IA");
    }
    setAnalysisLoading(false);
  };

  if (loading && !data) {
    return (
      <div className="flex items-center justify-center py-20">
        <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (data && !data.configured) {
    return (
      <Card className="max-w-lg mx-auto mt-8">
        <CardHeader className="text-center">
          <BarChart3 className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
          <CardTitle>Google Analytics no configurado</CardTitle>
        </CardHeader>
        <CardContent className="text-center text-sm text-muted-foreground space-y-2">
          <p>Para activar esta sección, configura las credenciales de Google Analytics.</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="max-w-lg mx-auto mt-8">
        <CardContent className="pt-6 text-center text-sm text-destructive">
          Error: {error}
        </CardContent>
      </Card>
    );
  }

  const overview = data?.overview;
  const sources = data?.sources || [];
  const topPages = data?.topPages || [];
  const referrals = data?.referrals || [];
  const totalSessions = sources.reduce((s, c) => s + c.sessions, 0);

  const pieData = sources.map((s, i) => ({
    name: s.channel,
    value: s.sessions,
    fill: getChannelColor(s.channel, i),
    pct: totalSessions > 0 ? ((s.sessions / totalSessions) * 100).toFixed(1) : "0",
  }));

  const funnelBarData = funnel.map(s => ({
    name: s.step_label,
    users: s.users,
    dropoff: s.dropoff_pct,
  }));

  return (
    <div className="space-y-6">
      {/* Period selector + refresh */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BarChart3 className="h-5 w-5 text-primary" />
          <h2 className="font-semibold text-lg">Tráfico de tonimateos.com</h2>
        </div>
        <div className="flex items-center gap-2">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Últimos 7 días</SelectItem>
              <SelectItem value="30">Últimos 30 días</SelectItem>
              <SelectItem value="90">Últimos 90 días</SelectItem>
              <SelectItem value="365">Último año</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" onClick={fetchAll} disabled={loading || funnelLoading}>
            <RefreshCw className={`h-4 w-4 ${loading || funnelLoading ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="pt-4 pb-3 text-center">
            <Users className="h-5 w-5 mx-auto text-primary mb-1" />
            <p className="text-2xl font-bold">{overview?.totalUsers?.toLocaleString() ?? "—"}</p>
            <p className="text-xs text-muted-foreground">Usuarios</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-3 text-center">
            <UserPlus className="h-5 w-5 mx-auto text-emerald-400 mb-1" />
            <p className="text-2xl font-bold">{overview?.newUsers?.toLocaleString() ?? "—"}</p>
            <p className="text-xs text-muted-foreground">Nuevos usuarios</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-3 text-center">
            <Activity className="h-5 w-5 mx-auto text-blue-400 mb-1" />
            <p className="text-2xl font-bold">{overview?.sessions?.toLocaleString() ?? "—"}</p>
            <p className="text-xs text-muted-foreground">Sesiones</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-3 text-center">
            <Clock className="h-5 w-5 mx-auto text-amber-400 mb-1" />
            <p className="text-2xl font-bold">{overview ? formatDuration(overview.avgSessionDuration) : "—"}</p>
            <p className="text-xs text-muted-foreground">Duración media</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-3 text-center">
            <Eye className="h-5 w-5 mx-auto text-purple-400 mb-1" />
            <p className="text-2xl font-bold">{overview?.pageViews?.toLocaleString() ?? "—"}</p>
            <p className="text-xs text-muted-foreground">Páginas vistas</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-3 text-center">
            <TrendingUp className="h-5 w-5 mx-auto text-rose-400 mb-1" />
            <p className="text-2xl font-bold">{overview ? `${(overview.bounceRate * 100).toFixed(1)}%` : "—"}</p>
            <p className="text-xs text-muted-foreground">Rebote</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts: bar + pie */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Canales de adquisición</CardTitle>
          </CardHeader>
          <CardContent>
            {sources.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={sources} layout="vertical" margin={{ left: 10, right: 20 }}>
                  <XAxis type="number" tick={{ fontSize: 12 }} />
                  <YAxis dataKey="channel" type="category" width={120} tick={{ fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 13 }}
                    formatter={(value: number) => [`${value} sesiones`, ""]}
                  />
                  <Bar dataKey="sessions" radius={[0, 4, 4, 0]}>
                    {sources.map((entry, idx) => (
                      <Cell key={idx} fill={getChannelColor(entry.channel, idx)} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-center text-sm text-muted-foreground py-12">Sin datos</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Distribución de tráfico</CardTitle>
          </CardHeader>
          <CardContent>
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    label={({ name, pct }) => `${name} (${pct}%)`}
                  >
                    {pieData.map((entry, idx) => (
                      <Cell key={idx} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 13 }}
                    formatter={(value: number) => [`${value} sesiones`, ""]}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-center text-sm text-muted-foreground py-12">Sin datos</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Source breakdown table */}
      {sources.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Detalle por canal</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {sources.map((s, i) => {
                const pct = totalSessions > 0 ? (s.sessions / totalSessions) * 100 : 0;
                return (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: getChannelColor(s.channel, i) }} />
                    <span className="text-sm flex-1">{s.channel}</span>
                    <span className="text-sm font-mono">{s.sessions.toLocaleString()}</span>
                    <Badge variant="outline" className="text-xs font-mono">{pct.toFixed(1)}%</Badge>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* ===== TOP PAGES, REFERRALS, CHANNELS ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top 10 Pages */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Eye className="h-4 w-4 text-primary" />
              Páginas más visitadas
            </CardTitle>
          </CardHeader>
          <CardContent>
            {topPages.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={topPages} layout="vertical" margin={{ left: 10, right: 20 }}>
                  <XAxis type="number" tick={{ fontSize: 12 }} />
                  <YAxis dataKey="path" type="category" width={150} tick={{ fontSize: 10 }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 13 }}
                    formatter={(value: number) => [`${value.toLocaleString()} vistas`, ""]}
                  />
                  <Bar dataKey="views" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-center text-sm text-muted-foreground py-12">Sin datos</p>
            )}
          </CardContent>
        </Card>

        {/* Referral Sources */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Activity className="h-4 w-4 text-primary" />
              Sitios web de referencia
            </CardTitle>
          </CardHeader>
          <CardContent>
            {referrals.length > 0 ? (
              <div className="space-y-2">
                {referrals.map((r, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: `hsl(${(i * 37) % 360}, 65%, 55%)` }} />
                    <span className="text-sm flex-1 truncate">{r.source}</span>
                    <span className="text-sm font-mono">{r.sessions.toLocaleString()}</span>
                    <Badge variant="outline" className="text-xs font-mono">
                      {totalSessions > 0 ? ((r.sessions / totalSessions) * 100).toFixed(1) : "0"}%
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-sm text-muted-foreground py-12">Sin datos</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* ===== FUNNEL SECTION ===== */}
      <div className="border-t border-border pt-6">
        <div className="flex items-center gap-3 mb-4">
          <TrendingUp className="h-5 w-5 text-primary" />
          <h2 className="font-semibold text-lg">Embudo de conversión — Configurador</h2>
        </div>

        {funnelLoading ? (
          <div className="flex items-center justify-center py-12">
            <RefreshCw className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : funnel.length > 0 && funnel.some(s => s.users > 0) ? (
          <>
            {/* Funnel bar chart */}
            <Card className="mb-4">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Usuarios por paso</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={funnelBarData} margin={{ left: 10, right: 20 }}>
                    <XAxis dataKey="name" tick={{ fontSize: 11 }} angle={-30} textAnchor="end" height={60} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip
                      contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 13 }}
                      formatter={(value: number, name: string) => {
                        if (name === "users") return [`${value} usuarios`, "Usuarios"];
                        return [`${value}%`, "Abandono"];
                      }}
                    />
                    <Bar dataKey="users" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Funnel table */}
            <Card className="mb-4">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Detalle del embudo</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {funnel.map((s) => (
                    <div key={s.step_number} className="flex items-center gap-3">
                      <Badge variant="outline" className="text-xs w-6 justify-center">{s.step_number}</Badge>
                      <span className="text-sm flex-1">{s.step_label}</span>
                      <span className="text-sm font-mono">{s.users} usuarios</span>
                      {s.step_number > 1 && (
                        <Badge variant="outline" className="text-xs font-mono">
                          Ret. {s.retention_pct}%
                        </Badge>
                      )}
                      {s.step_number > 1 && (
                        <Badge
                          variant={s.dropoff_pct > 30 ? "destructive" : "outline"}
                          className="text-xs font-mono"
                        >
                          -{s.dropoff_pct}%
                        </Badge>
                      )}
                      {s.step_number > 1 && (
                        <Badge variant="secondary" className="text-xs font-mono">
                          Acum. -{s.cumulative_dropoff_pct}%
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* AI Analysis button */}
            <Button
              onClick={handleAnalyze}
              disabled={analysisLoading}
              className="gap-2"
              variant="default"
            >
              {analysisLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Brain className="h-4 w-4" />
              )}
              {analysisLoading ? "Analizando..." : "Explícamelo"}
            </Button>
          </>
        ) : (
          <Card>
            <CardContent className="py-8 text-center text-sm text-muted-foreground">
              Aún no hay datos de embudo. Los eventos <code>step_view</code> se registrarán cuando los usuarios naveguen por el configurador.
            </CardContent>
          </Card>
        )}

        {/* AI Analysis result */}
        {analysis && (
          <Card className="mt-4 border-primary/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Brain className="h-4 w-4 text-primary" />
                Diagnóstico de IA
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <ReactMarkdown>{analysis}</ReactMarkdown>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
