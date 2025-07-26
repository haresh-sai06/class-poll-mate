import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { getPolls, hasUserResponded, saveResponse, Poll, User } from '@/lib/storage';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, Clock, Send } from 'lucide-react';
import { ThemeToggle } from '@/components/ui/theme-toggle';

interface StudentDashboardProps {
  user: User;
  onLogout: () => void;
}

export const StudentDashboard = ({ user, onLogout }: StudentDashboardProps) => {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [submittingPolls, setSubmittingPolls] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  useEffect(() => {
    setPolls(getPolls());
  }, []);

  const handleSubmitResponse = async (pollId: string) => {
    const selectedOption = selectedAnswers[pollId];
    
    if (!selectedOption) {
      toast({
        title: "No Option Selected",
        description: "Please select an option before submitting",
        variant: "destructive",
      });
      return;
    }

    setSubmittingPolls(prev => new Set([...prev, pollId]));
    
    // Simulate submission delay for better UX
    setTimeout(() => {
      saveResponse({
        pollId,
        rollNumber: user.rollNumber,
        option: selectedOption,
      });

      // Remove the selected answer for this poll
      setSelectedAnswers(prev => {
        const newAnswers = { ...prev };
        delete newAnswers[pollId];
        return newAnswers;
      });

      setSubmittingPolls(prev => {
        const newSet = new Set(prev);
        newSet.delete(pollId);
        return newSet;
      });

      toast({
        title: "Response Submitted!",
        description: "Your answer has been recorded successfully",
      });

      // Refresh polls to update answered status
      setPolls(getPolls());
    }, 1000);
  };

  const isAnswered = (pollId: string) => {
    return hasUserResponded(pollId, user.rollNumber);
  };

  const isSubmitting = (pollId: string) => {
    return submittingPolls.has(pollId);
  };

  const answeredPolls = polls.filter(poll => isAnswered(poll.id));
  const unansweredPolls = polls.filter(poll => !isAnswered(poll.id));

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">SKCT Student Portal</h1>
            <p className="text-muted-foreground">Welcome, {user.name}! (Roll: {user.rollNumber})</p>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button variant="destructive" onClick={onLogout}>
              Logout
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardContent className="text-center py-4">
              <div className="text-2xl font-bold text-primary">{polls.length}</div>
              <div className="text-sm text-muted-foreground">Total Polls</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="text-center py-4">
              <div className="text-2xl font-bold text-success">{answeredPolls.length}</div>
              <div className="text-sm text-muted-foreground">Completed</div>
            </CardContent>
          </Card>
        </div>

        {/* Unanswered Polls */}
        {unansweredPolls.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-warning" />
              <h2 className="text-xl font-semibold">Pending Polls ({unansweredPolls.length})</h2>
            </div>
            
            <div className="space-y-4">
              {unansweredPolls.map((poll) => (
                <Card key={poll.id} className="border-l-4 border-l-warning">
                  <CardHeader>
                    <CardTitle className="text-lg">{poll.question}</CardTitle>
                    <Badge variant="outline" className="w-fit">
                      <Clock className="w-3 h-3 mr-1" />
                      Pending Response
                    </Badge>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <RadioGroup
                      value={selectedAnswers[poll.id] || ''}
                      onValueChange={(value) => 
                        setSelectedAnswers(prev => ({ ...prev, [poll.id]: value }))
                      }
                      disabled={isSubmitting(poll.id)}
                    >
                      {poll.options.map((option, index) => (
                        <div key={index} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                          <RadioGroupItem 
                            value={option} 
                            id={`${poll.id}-${index}`}
                            className="w-5 h-5"
                          />
                          <Label 
                            htmlFor={`${poll.id}-${index}`}
                            className="flex-1 text-base cursor-pointer"
                          >
                            {option}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>

                    <Button
                      onClick={() => handleSubmitResponse(poll.id)}
                      disabled={!selectedAnswers[poll.id] || isSubmitting(poll.id)}
                      className="w-full"
                      variant="mobile"
                    >
                      {isSubmitting(poll.id) ? (
                        'Submitting...'
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          Submit Response
                        </>
                      )}
                    </Button>

                    <p className="text-xs text-muted-foreground text-center">
                      Created: {new Date(poll.createdAt).toLocaleDateString()} at {new Date(poll.createdAt).toLocaleTimeString()}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Answered Polls */}
        {answeredPolls.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-success" />
              <h2 className="text-xl font-semibold">Completed Polls ({answeredPolls.length})</h2>
            </div>
            
            <div className="space-y-4">
              {answeredPolls.map((poll) => (
                <Card key={poll.id} className="border-l-4 border-l-success opacity-75">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      {poll.question}
                      <CheckCircle className="w-5 h-5 text-success" />
                    </CardTitle>
                    <Badge variant="secondary" className="w-fit">
                      Response Submitted
                    </Badge>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {poll.options.map((option, index) => (
                        <div 
                          key={index} 
                          className="p-3 rounded-lg bg-muted/30 text-muted-foreground"
                        >
                          {option}
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground mt-4">
                      Completed on {new Date(poll.createdAt).toLocaleDateString()}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* No Polls State */}
        {polls.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No Polls Available</h3>
              <p className="text-muted-foreground">
                Your tutor hasn't created any polls yet. Check back later!
              </p>
            </CardContent>
          </Card>
        )}

        {/* All Complete State */}
        {polls.length > 0 && unansweredPolls.length === 0 && (
          <Card className="border-success/50 bg-success/5">
            <CardContent className="text-center py-8">
              <CheckCircle className="w-12 h-12 text-success mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-success mb-2">All Caught Up!</h3>
              <p className="text-muted-foreground">
                You've completed all available polls. Great job!
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};