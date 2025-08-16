import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Mail, Link, Copy, Check, Send, Users, Plus, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface InviteMemberModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const InviteMemberModal: React.FC<InviteMemberModalProps> = ({
  open,
  onOpenChange,
}) => {
  const { toast } = useToast();

  // Email invitation state
  const [emailList, setEmailList] = useState<string[]>(['']);
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [customMessage, setCustomMessage] = useState('');
  const [isEmailLoading, setIsEmailLoading] = useState(false);

  // Link generation state
  const [generatedLink, setGeneratedLink] = useState<string>('');
  const [linkRole, setLinkRole] = useState<string>('');
  const [linkExpiry, setLinkExpiry] = useState<string>('7');
  const [isLinkLoading, setIsLinkLoading] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  const roles = [
    { value: 'developer', label: 'Developer' },
    { value: 'designer', label: 'Designer' },
    { value: 'manager', label: 'Project Manager' },
    { value: 'tester', label: 'QA Tester' },
    { value: 'analyst', label: 'Business Analyst' },
    { value: 'devops', label: 'DevOps Engineer' },
  ];

  const expiryOptions = [
    { value: '1', label: '1 day' },
    { value: '3', label: '3 days' },
    { value: '7', label: '7 days' },
    { value: '14', label: '14 days' },
    { value: '30', label: '30 days' },
    { value: 'never', label: 'Never' },
  ];

  const addEmailField = () => {
    setEmailList([...emailList, '']);
  };

  const removeEmailField = (index: number) => {
    if (emailList.length > 1) {
      setEmailList(emailList.filter((_, i) => i !== index));
    }
  };

  const updateEmail = (index: number, email: string) => {
    const newEmailList = [...emailList];
    newEmailList[index] = email;
    setEmailList(newEmailList);
  };

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const getValidEmails = () => {
    return emailList.filter(
      email => email.trim() && isValidEmail(email.trim())
    );
  };

  const handleSendInvitations = async () => {
    const validEmails = getValidEmails();

    if (validEmails.length === 0) {
      toast({
        title: 'Error',
        description: 'Please enter at least one valid email address',
        variant: 'destructive',
      });
      return;
    }

    if (!selectedRole) {
      toast({
        title: 'Error',
        description: 'Please select a role for the invitees',
        variant: 'destructive',
      });
      return;
    }

    setIsEmailLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      toast({
        title: 'Invitations Sent!',
        description: `${validEmails.length} invitation${validEmails.length > 1 ? 's' : ''} sent successfully`,
      });

      // Reset form
      setEmailList(['']);
      setSelectedRole('');
      setCustomMessage('');
      onOpenChange(false);
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to send invitations',
        variant: 'destructive',
      });
    } finally {
      setIsEmailLoading(false);
    }
  };

  const generateInviteLink = async () => {
    if (!linkRole) {
      toast({
        title: 'Error',
        description: 'Please select a role for the invite link',
        variant: 'destructive',
      });
      return;
    }

    setIsLinkLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Generate a mock invite link
      const linkId = Math.random().toString(36).substring(2, 15);
      const baseUrl = window.location.origin;
      const link = `${baseUrl}/join/${linkId}?role=${linkRole}&expires=${linkExpiry}`;

      setGeneratedLink(link);

      toast({
        title: 'Invite Link Generated!',
        description: 'Share this link with potential team members',
      });
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to generate invite link',
        variant: 'destructive',
      });
    } finally {
      setIsLinkLoading(false);
    }
  };

  const copyLinkToClipboard = async () => {
    if (!generatedLink) return;

    try {
      await navigator.clipboard.writeText(generatedLink);
      setLinkCopied(true);
      toast({
        title: 'Link Copied!',
        description: 'Invite link copied to clipboard',
      });

      // Reset copied state after 2 seconds
      setTimeout(() => setLinkCopied(false), 2000);
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to copy link to clipboard',
        variant: 'destructive',
      });
    }
  };

  const resetModal = () => {
    setEmailList(['']);
    setSelectedRole('');
    setCustomMessage('');
    setGeneratedLink('');
    setLinkRole('');
    setLinkExpiry('7');
    setLinkCopied(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={open => {
        if (!open) resetModal();
        onOpenChange(open);
      }}
    >
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Invite Team Members
          </DialogTitle>
          <DialogDescription>
            Invite new members to join your team via email or shareable link
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="email" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="email" className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Email Invitation
            </TabsTrigger>
            <TabsTrigger value="link" className="flex items-center gap-2">
              <Link className="w-4 h-4" />
              Invite Link
            </TabsTrigger>
          </TabsList>

          <TabsContent value="email" className="space-y-4 mt-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Email Addresses *</Label>
                <div className="space-y-2">
                  {emailList.map((email, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        type="email"
                        placeholder="colleague@company.com"
                        value={email}
                        onChange={e => updateEmail(index, e.target.value)}
                        className={
                          email.trim() && !isValidEmail(email.trim())
                            ? 'border-red-500'
                            : ''
                        }
                      />
                      {emailList.length > 1 && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeEmailField(index)}
                          className="px-3"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={addEmailField}
                  className="w-full"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Another Email
                </Button>
                <p className="text-sm text-muted-foreground">
                  {getValidEmails().length} valid email
                  {getValidEmails().length !== 1 ? 's' : ''} entered
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Role *</Label>
                <Select value={selectedRole} onValueChange={setSelectedRole}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role for the invitees" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map(role => (
                      <SelectItem key={role.value} value={role.value}>
                        {role.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Custom Message (Optional)</Label>
                <Textarea
                  id="message"
                  placeholder="Add a personal message to your invitation..."
                  value={customMessage}
                  onChange={e => setCustomMessage(e.target.value)}
                  rows={3}
                />
              </div>

              <Card className="bg-muted/30">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Preview</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <p>Invitees will receive an email with:</p>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Invitation to join your team</li>
                    <li>
                      Role:{' '}
                      {selectedRole
                        ? roles.find(r => r.value === selectedRole)?.label
                        : 'Not selected'}
                    </li>
                    <li>Setup instructions</li>
                    {customMessage && <li>Your custom message</li>}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="link" className="space-y-4 mt-6">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Role *</Label>
                  <Select value={linkRole} onValueChange={setLinkRole}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      {roles.map(role => (
                        <SelectItem key={role.value} value={role.value}>
                          {role.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Link Expires</Label>
                  <Select value={linkExpiry} onValueChange={setLinkExpiry}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {expiryOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button
                onClick={generateInviteLink}
                disabled={!linkRole || isLinkLoading}
                className="w-full"
              >
                {isLinkLoading ? (
                  'Generating Link...'
                ) : (
                  <>
                    <Link className="w-4 h-4 mr-2" />
                    Generate Invite Link
                  </>
                )}
              </Button>

              {generatedLink && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-500" />
                      Invite Link Generated
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex gap-2">
                      <Input
                        value={generatedLink}
                        readOnly
                        className="font-mono text-sm"
                      />
                      <Button
                        onClick={copyLinkToClipboard}
                        variant="outline"
                        size="sm"
                        className="px-3"
                      >
                        {linkCopied ? (
                          <Check className="w-4 h-4" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p>
                        • Role: {roles.find(r => r.value === linkRole)?.label}
                      </p>
                      <p>
                        • Expires:{' '}
                        {linkExpiry === 'never'
                          ? 'Never'
                          : `${linkExpiry} day${linkExpiry !== '1' ? 's' : ''}`}
                      </p>
                      <p>• Anyone with this link can join your team</p>
                    </div>
                  </CardContent>
                </Card>
              )}

              <Card className="bg-blue-50 dark:bg-blue-950/20">
                <CardContent className="pt-4">
                  <div className="flex gap-3">
                    <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                    <div className="text-sm text-blue-700 dark:text-blue-300">
                      <p className="font-medium mb-1">Share this link safely</p>
                      <p>
                        Only share invite links with people you trust. Anyone
                        with the link can join your team with the specified
                        role.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <div className="flex gap-2">
            <Tabs defaultValue="email" className="contents">
              <TabsContent value="email" className="contents">
                <Button
                  onClick={handleSendInvitations}
                  disabled={
                    getValidEmails().length === 0 ||
                    !selectedRole ||
                    isEmailLoading
                  }
                  className="min-w-[140px]"
                >
                  {isEmailLoading ? (
                    'Sending...'
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Send Invites
                    </>
                  )}
                </Button>
              </TabsContent>
            </Tabs>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
