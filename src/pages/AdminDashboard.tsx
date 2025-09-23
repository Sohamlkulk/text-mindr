import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Shield, Users, MessageSquare, BarChart3, LogOut, Activity, Eye } from 'lucide-react';
import { format } from 'date-fns';

interface User {
  id: string;
  email: string;
  created_at: string;
  last_sign_in_at: string;
}

interface Profile {
  id: string;
  user_id: string;
  email: string;
  created_at: string;
  updated_at: string;
}

interface Analysis {
  id: string;
  user_id: string;
  original_text: string;
  summary: string;
  sentiment_score: number;
  sentiment_label: string;
  word_cloud_data: any;
  analysis_data: any;
  created_at: string;
  profiles: Profile;
}

export default function AdminDashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check admin authentication
    const adminSession = localStorage.getItem('adminSession');
    const sessionExpiry = localStorage.getItem('adminSessionExpiry');
    
    if (!adminSession || !sessionExpiry || Date.now() > parseInt(sessionExpiry)) {
      toast({
        title: "Session Expired",
        description: "Please log in again",
        variant: "destructive"
      });
      localStorage.removeItem('adminSession');
      localStorage.removeItem('adminSessionExpiry');
      navigate('/admin-auth');
      return;
    }
    
    fetchData();
  }, [navigate]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch users via admin function
      const { data: usersData, error: usersError } = await supabase.functions.invoke('admin-get-users');
      if (usersError) throw usersError;
      
      // Fetch profiles
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      if (profilesError) throw profilesError;
      
      // Fetch all analyses with user profiles
      const { data: analysesData, error: analysesError } = await supabase
        .from('text_analyses')
        .select(`
          *,
          profiles!inner(*)
        `)
        .order('created_at', { ascending: false });
      if (analysesError) throw analysesError;
      
      setUsers(usersData?.users || []);
      setProfiles(profilesData || []);
      setAnalyses(analysesData || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to fetch data",
        variant: "destructive"
      });
    }
    setLoading(false);
  };

  const handleSignOut = () => {
    localStorage.removeItem('adminSession');
    localStorage.removeItem('adminSessionExpiry');
    toast({
      title: "Signed Out",
      description: "Successfully signed out from admin portal"
    });
    navigate('/admin-auth');
  };

  const getUserAnalyses = (userId: string) => {
    return analyses.filter(analysis => analysis.user_id === userId);
  };

  const getTotalAnalyses = (userId: string) => {
    return getUserAnalyses(userId).length;
  };

  const getLatestActivity = (userId: string) => {
    const userAnalyses = getUserAnalyses(userId);
    if (userAnalyses.length === 0) return 'No activity';
    return format(new Date(userAnalyses[0].created_at), 'MMM dd, yyyy HH:mm');
  };

  const getAverageSentiment = (userId: string) => {
    const userAnalyses = getUserAnalyses(userId);
    if (userAnalyses.length === 0) return 0;
    const sum = userAnalyses.reduce((acc, analysis) => acc + (analysis.sentiment_score || 0), 0);
    return (sum / userAnalyses.length).toFixed(2);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Shield className="h-12 w-12 text-primary mx-auto mb-4 animate-spin" />
          <p className="text-muted-foreground">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
      
      <div className="relative z-10 max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold gradient-primary bg-clip-text text-transparent">
                Admin Dashboard
              </h1>
              <p className="text-muted-foreground">User management and analytics overview</p>
            </div>
          </div>
          
          <Button
            onClick={handleSignOut}
            variant="outline"
            className="transition-smooth hover:shadow-glow"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="gradient-card border-border/20 shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{profiles.length}</div>
            </CardContent>
          </Card>
          
          <Card className="gradient-card border-border/20 shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Analyses</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analyses.length}</div>
            </CardContent>
          </Card>
          
          <Card className="gradient-card border-border/20 shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Today</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {analyses.filter(a => {
                  const today = new Date();
                  const analysisDate = new Date(a.created_at);
                  return analysisDate.toDateString() === today.toDateString();
                }).length}
              </div>
            </CardContent>
          </Card>
          
          <Card className="gradient-card border-border/20 shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Sentiment</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {analyses.length > 0 ? 
                  (analyses.reduce((acc, a) => acc + (a.sentiment_score || 0), 0) / analyses.length).toFixed(2) 
                  : '0.00'
                }
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="users" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Users
            </TabsTrigger>
            <TabsTrigger value="analyses" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              All Analyses
            </TabsTrigger>
            <TabsTrigger value="activity" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              User Activity
            </TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <Card className="gradient-card border-border/20 shadow-card">
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>Overview of all registered users</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Email</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead>Analyses</TableHead>
                      <TableHead>Avg Sentiment</TableHead>
                      <TableHead>Last Activity</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {profiles.map((profile) => (
                      <TableRow key={profile.id}>
                        <TableCell className="font-medium">{profile.email}</TableCell>
                        <TableCell>{format(new Date(profile.created_at), 'MMM dd, yyyy')}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">
                            {getTotalAnalyses(profile.user_id)}
                          </Badge>
                        </TableCell>
                        <TableCell>{getAverageSentiment(profile.user_id)}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {getLatestActivity(profile.user_id)}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedUser(selectedUser === profile.user_id ? null : profile.user_id)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analyses">
            <Card className="gradient-card border-border/20 shadow-card">
              <CardHeader>
                <CardTitle>All Text Analyses</CardTitle>
                <CardDescription>Complete history of all user analyses</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Sentiment</TableHead>
                      <TableHead>Score</TableHead>
                      <TableHead>Text Preview</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {analyses.map((analysis) => (
                      <TableRow key={analysis.id}>
                        <TableCell className="font-medium">{analysis.profiles.email}</TableCell>
                        <TableCell>{format(new Date(analysis.created_at), 'MMM dd, yyyy HH:mm')}</TableCell>
                        <TableCell>
                          <Badge variant={
                            analysis.sentiment_score > 0.1 ? "default" : 
                            analysis.sentiment_score < -0.1 ? "destructive" : "secondary"
                          }>
                            {analysis.sentiment_label}
                          </Badge>
                        </TableCell>
                        <TableCell>{analysis.sentiment_score?.toFixed(2) || 'N/A'}</TableCell>
                        <TableCell className="max-w-xs truncate">
                          {analysis.original_text}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity">
            <Card className="gradient-card border-border/20 shadow-card">
              <CardHeader>
                <CardTitle>User Activity Log</CardTitle>
                <CardDescription>Detailed activity tracking for all users</CardDescription>
              </CardHeader>
              <CardContent>
                {selectedUser ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">
                        Activity for {profiles.find(p => p.user_id === selectedUser)?.email}
                      </h3>
                      <Button variant="ghost" onClick={() => setSelectedUser(null)}>
                        View All
                      </Button>
                    </div>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Action</TableHead>
                          <TableHead>Sentiment</TableHead>
                          <TableHead>Details</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {getUserAnalyses(selectedUser).map((analysis) => (
                          <TableRow key={analysis.id}>
                            <TableCell>{format(new Date(analysis.created_at), 'MMM dd, yyyy HH:mm')}</TableCell>
                            <TableCell>Text Analysis</TableCell>
                            <TableCell>
                              <Badge variant={
                                analysis.sentiment_score > 0.1 ? "default" : 
                                analysis.sentiment_score < -0.1 ? "destructive" : "secondary"
                              }>
                                {analysis.sentiment_label}
                              </Badge>
                            </TableCell>
                            <TableCell className="max-w-xs truncate">
                              {analysis.summary}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Total Analyses</TableHead>
                        <TableHead>Last Activity</TableHead>
                        <TableHead>Avg Sentiment</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {profiles.map((profile) => (
                        <TableRow 
                          key={profile.id} 
                          className="cursor-pointer hover:bg-muted/50"
                          onClick={() => setSelectedUser(profile.user_id)}
                        >
                          <TableCell className="font-medium">{profile.email}</TableCell>
                          <TableCell>{getTotalAnalyses(profile.user_id)}</TableCell>
                          <TableCell>{getLatestActivity(profile.user_id)}</TableCell>
                          <TableCell>{getAverageSentiment(profile.user_id)}</TableCell>
                          <TableCell>
                            <Badge variant={getTotalAnalyses(profile.user_id) > 0 ? "default" : "secondary"}>
                              {getTotalAnalyses(profile.user_id) > 0 ? "Active" : "Inactive"}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}