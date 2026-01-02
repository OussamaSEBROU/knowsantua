
export interface Axiom {
  axiom: string;
  definition: string;
}

export interface Message {
  role: 'user' | 'model';
  text: string;
  isArabic?: boolean;
}

export interface Conversation {
  id: string;
  title: string;
  history: Message[];
  pdfBase64: string | null;
  pdfName: string | null;
  axioms: Axiom[];
  timestamp: number;
}

export interface ResearchState {
  activeId: string | null;
  pdfBase64: string | null;
  pdfUrl: string | null;
  pdfName: string | null;
  axioms: Axiom[];
  chatHistory: Message[];
  isProcessing: boolean;
  status: string;
  language: 'en' | 'ar';
}
