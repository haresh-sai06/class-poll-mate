import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { getPolls, savePoll, deletePoll, getUsers, getPollResponses, Poll, User } from '@/lib/storage';
import { useToast } from '@/hooks/use-toast';
import { Plus, Trash2, Users, BarChart3 } from 'lucide-react';

interface TutorDashboardProps {
  user: User;
  onLogout: () => void;
}

export const TutorDashboard = ({ user, onLogout }: TutorDashboardProps) => {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedPoll, setSelectedPoll] = useState<Poll | null>(null);
  const [newPoll, setNewPoll] = useState({
    question: '',
    optionCount: '2',
    options: ['', '']
  });
  const { toast } = useToast();

  useEffect(() => {
    setPolls(getPolls());
  }, []);

  const handleCreatePoll = () => {
    if (!newPoll.question.trim() || newPoll.options.some(opt => !opt.trim())) {
      toast({
        title: "Incomplete Poll",
        description: "Please fill in the question and all options",
        variant: "destructive",
      });
      return;
    }

    const poll = savePoll({
      question: newPoll.question,
      options: newPoll.options.filter(opt => opt.trim()),
      createdAt: new Date().toISOString(),
    });

    setPolls([...polls, poll]);
    setNewPoll({ question: '', optionCount: '2', options: ['', ''] });
    setShowCreateForm(false);
    
    toast({
      title: "Poll Created",
      description: "Your poll has been created successfully!",
    });
  };

  const handleDeletePoll = (pollId: string) => {
    deletePoll(pollId);
    setPolls(polls.filter(poll => poll.id !== pollId));
    setSelectedPoll(null);
    
    toast({
      title: "Poll Deleted",
      description: "The poll has been removed",
    });
  };

  const updateOptionCount = (count: string) => {
    const numOptions = parseInt(count);
    const newOptions = [...newPoll.options];
    
    if (numOptions > newOptions.length) {
      for (let i = newOptions.length; i < numOptions; i++) {
        newOptions.push('');
      }
    } else {
      newOptions.splice(numOptions);
    }
    
    setNewPoll({ ...newPoll, optionCount: count, options: newOptions });
  };

  const getPollStats = (poll: Poll) => {
    const responses = getPollResponses(poll.id);
    const students = getUsers().filter(u => !u.isAdmin);
    const respondedCount = responses.length;
    const totalStudents = students.length;
    
    return {
      responded: respondedCount,
      total: totalStudents,
      percentage: totalStudents > 0 ? Math.round((respondedCount / totalStudents) * 100) : 0,
      responses,
      students
    };
  };

  if (selectedPoll) {
    const stats = getPollStats(selectedPoll);
    const respondedUsers = stats.responses.map(r => r.rollNumber);
    const nonRespondedUsers = stats.students.filter(s => !respondedUsers.includes(s.rollNumber));
    
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <Button 
              variant="outline" 
              onClick={() => setSelectedPoll(null)}
              className="mb-4"
            >
              ← Back to Dashboard
            </Button>
            <Button variant="destructive" onClick={onLogout}>
              Logout
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Poll Results
              </CardTitle>
              <p className="text-lg font-medium">{selectedPoll.question}</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-success/10 rounded-lg">
                  <div className="text-2xl font-bold text-success">{stats.responded}</div>
                  <div className="text-sm text-muted-foreground">Responded</div>
                </div>
                <div className="text-center p-4 bg-warning/10 rounded-lg">
                  <div className="text-2xl font-bold text-warning">{stats.total - stats.responded}</div>
                  <div className="text-sm text-muted-foreground">Pending</div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold">Response Breakdown:</h3>
                {selectedPoll.options.map((option, index) => {
                  const optionCount = stats.responses.filter(r => r.option === option).length;
                  const percentage = stats.responded > 0 ? Math.round((optionCount / stats.responded) * 100) : 0;
                  
                  return (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between">
                        <span>{option}</span>
                        <span>{optionCount} votes ({percentage}%)</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full transition-all duration-300"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              {stats.responses.length > 0 && (
                <div className="space-y-4">
                  <h3 className="font-semibold">Students Who Responded:</h3>
                  <div className="grid gap-2">
                    {stats.responses.map((response, index) => {
                      const student = stats.students.find(s => s.rollNumber === response.rollNumber);
                      return (
                        <div key={index} className="flex justify-between items-center p-3 bg-success/10 rounded-lg">
                          <span>{student?.name} (Roll: {response.rollNumber})</span>
                          <Badge variant="secondary">{response.option}</Badge>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {nonRespondedUsers.length > 0 && (
                <div className="space-y-4">
                  <h3 className="font-semibold">Students Who Haven't Responded:</h3>
                  <div className="grid gap-2">
                    {nonRespondedUsers.map((student, index) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-warning/10 rounded-lg">
                        <span>{student.name} (Roll: {student.rollNumber})</span>
                        <Badge variant="outline">Pending</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Tutor Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, {user.name}!</p>
          </div>
          <Button variant="destructive" onClick={onLogout}>
            Logout
          </Button>
        </div>

        {/* Create Poll Button */}
        <Button 
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="w-full sm:w-auto"
          variant="mobile"
        >
          <Plus className="w-4 h-4 mr-2" />
          {showCreateForm ? 'Cancel' : 'Create New Poll'}
        </Button>

        {/* Create Poll Form */}
        {showCreateForm && (
          <Card>
            <CardHeader>
              <CardTitle>Create New Poll</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="question">Poll Question</Label>
                <Textarea
                  id="question"
                  placeholder="Enter your poll question..."
                  value={newPoll.question}
                  onChange={(e) => setNewPoll({ ...newPoll, question: e.target.value })}
                  className="min-h-[100px]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="optionCount">Number of Options</Label>
                <Select value={newPoll.optionCount} onValueChange={updateOptionCount}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[2, 3, 4, 5].map(num => (
                      <SelectItem key={num} value={num.toString()}>
                        {num} options
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label>Poll Options</Label>
                {newPoll.options.map((option, index) => (
                  <Input
                    key={index}
                    placeholder={`Option ${index + 1}`}
                    value={option}
                    onChange={(e) => {
                      const newOptions = [...newPoll.options];
                      newOptions[index] = e.target.value;
                      setNewPoll({ ...newPoll, options: newOptions });
                    }}
                    className="h-12"
                  />
                ))}
              </div>

              <Button onClick={handleCreatePoll} className="w-full" variant="mobile">
                Create Poll
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Polls List */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Your Polls ({polls.length})</h2>
          
          {polls.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-muted-foreground">No polls created yet. Create your first poll to get started!</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {polls.map((poll) => {
                const stats = getPollStats(poll);
                return (
                  <Card key={poll.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg mb-2">{poll.question}</h3>
                            <div className="flex flex-wrap gap-2">
                              {poll.options.map((option, index) => (
                                <Badge key={index} variant="outline">{option}</Badge>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            <span>{stats.responded}/{stats.total} responses ({stats.percentage}%)</span>
                          </div>
                          <span>Created: {new Date(poll.createdAt).toLocaleDateString()}</span>
                        </div>

                        <div className="flex gap-2">
                          <Button 
                            onClick={() => setSelectedPoll(poll)}
                            variant="default"
                            className="flex-1"
                          >
                            <BarChart3 className="w-4 h-4 mr-2" />
                            View Results
                          </Button>
                          <Button 
                            onClick={() => handleDeletePoll(poll.id)}
                            variant="destructive"
                            size="icon"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};