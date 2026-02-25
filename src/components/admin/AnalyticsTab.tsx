import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Activity, Clock, Eye, TrendingUp, UserPlus, RefreshCw, BarChart3 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend } from "recharts";

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
  period?: number;
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

const getChannelColor = (channel: string, idx: number) => {
  return CHANNEL_COLORS[channel] || `hsl(${(idx * 47) % 360}, 60%, 55%)`;
};

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

  const fetchAnalytics = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const url = new URL(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/analytics-ga`);
      url.searchParams.set("period", period);
      const res = await fetch(url.toString(), {
        headers: {
          "x-admin-password": storedPassword,
          "apikey": import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) throw new Error("Error fetching analytics");
      const json = await res.json();
      setData(json);
    } catch (e: any) {
      setError(e.message);
    }
    setLoading(false);
  }, [storedPassword, period]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

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
          <p>Para activar esta sección, configura las credenciales de Google Analytics (cuenta de servicio + Property ID).</p>
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
  const totalSessions = sources.reduce((s, c) => s + c.sessions, 0);

  const pieData = sources.map((s, i) => ({
    name: s.channel,
    value: s.sessions,
    fill: getChannelColor(s.channel, i),
    pct: totalSessions > 0 ? ((s.sessions / totalSessions) * 100).toFixed(1) : "0",
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
          <Button variant="outline" size="sm" onClick={fetchAnalytics} disabled={loading}>
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
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
        {/* Bar chart */}
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

        {/* Pie chart */}
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
    </div>
  );
}
