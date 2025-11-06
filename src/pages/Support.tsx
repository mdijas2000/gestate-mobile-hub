import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ArrowLeft, Search, MessageSquare, Phone, Mail } from "lucide-react";
import { toast } from "sonner";

export default function Support() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [feedback, setFeedback] = useState("");

  const faqs = [
    {
      question: "How do I book a service?",
      answer: "Select your desired service from the dashboard, enter pickup and drop-off locations, add any special instructions, and confirm your booking. A provider will be matched with you shortly.",
    },
    {
      question: "How is pricing calculated?",
      answer: "Pricing is based on the base price for the service type plus distance traveled. You'll see an estimated price before confirming your booking.",
    },
    {
      question: "Can I cancel a booking?",
      answer: "Yes, you can cancel a booking before it's accepted by a provider. Once accepted, cancellation policies may apply.",
    },
    {
      question: "How do I become a service provider?",
      answer: "Select 'Service Provider' during registration, complete your profile with vehicle details, and upload required documents for verification.",
    },
    {
      question: "What payment methods are supported?",
      answer: "We support credit/debit cards, digital wallets, and cash payments depending on your location.",
    },
  ];

  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmitFeedback = () => {
    if (!feedback.trim()) {
      toast.error("Please enter your feedback");
      return;
    }
    toast.success("Thank you for your feedback!");
    setFeedback("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10">
      <header className="bg-card border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-bold">Help & Support</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Contact Us</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-auto py-4 flex-col gap-2">
              <MessageSquare className="w-6 h-6 text-primary" />
              <span className="font-semibold">Live Chat</span>
              <span className="text-xs text-muted-foreground">Available 24/7</span>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex-col gap-2">
              <Phone className="w-6 h-6 text-primary" />
              <span className="font-semibold">Call Support</span>
              <span className="text-xs text-muted-foreground">+1-800-DELI</span>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex-col gap-2">
              <Mail className="w-6 h-6 text-primary" />
              <span className="font-semibold">Email</span>
              <span className="text-xs text-muted-foreground">support@deliride.com</span>
            </Button>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Frequently Asked Questions</h2>
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search FAQs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          <Accordion type="single" collapsible className="w-full">
            {filteredFaqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger>{faq.question}</AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          {filteredFaqs.length === 0 && (
            <p className="text-center text-muted-foreground py-8">
              No FAQs found matching your search.
            </p>
          )}
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Send Feedback</h2>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="feedback">Your Feedback</Label>
              <Textarea
                id="feedback"
                placeholder="Tell us how we can improve..."
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                rows={5}
              />
            </div>
            <Button
              onClick={handleSubmitFeedback}
              className="w-full gradient-primary text-white"
            >
              Submit Feedback
            </Button>
          </div>
        </Card>
      </main>
    </div>
  );
}
