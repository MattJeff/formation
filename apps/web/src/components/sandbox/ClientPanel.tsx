'use client';

import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CheckCircle2, Circle, Send, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

interface Objective {
  id: string;
  text: string;
  completed: boolean;
}

const mockObjectives: Objective[] = [
  { id: '1', text: 'Mettre en place la structure HTML de base', completed: true },
  { id: '2', text: 'Créer une grille de 6 photos', completed: true },
  { id: '3', text: 'Rendre les photos cliquables pour les afficher en grand', completed: false },
  { id: '4', text: 'Ajouter un formulaire de contact', completed: false },
];

const mockMessages: Message[] = [
  {
    id: '1',
    sender: 'ai',
    content:
      "Salut ! Je suis **Chloé**, photographe professionnelle. J'ai besoin d'un site portfolio pour exposer mon travail. Pour la V1, je veux :\n\n- Une page d'accueil avec mon nom en grand\n- Une grille de **6 photos** cliquables\n- Un pied de page avec mon email\n\nJ'ai déposé 6 images dans le dossier `/images`. À toi de jouer ! 📸",
    timestamp: new Date(Date.now() - 3600000),
  },
];

export function ClientPanel() {
  const [activeTab, setActiveTab] = useState<'brief' | 'chat'>('brief');
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [inputValue, setInputValue] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [objectives, setObjectives] = useState<Objective[]>(mockObjectives);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages([...messages, newMessage]);
    setInputValue('');

    // Simuler une réponse de l'IA après 2 secondes
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        content:
          "Merci pour ton message ! Je vais regarder ton travail. N'hésite pas à me soumettre ton projet quand tu es prêt.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiResponse]);
    }, 2000);
  };

  const handleSubmitProject = () => {
    setIsSubmitting(true);

    // Simuler la vérification (15 secondes)
    setTimeout(() => {
      setIsSubmitting(false);

      // Simuler la validation de certains objectifs
      setObjectives((prev) =>
        prev.map((obj) => (obj.id === '3' ? { ...obj, completed: true } : obj))
      );

      const feedbackMessage: Message = {
        id: Date.now().toString(),
        sender: 'ai',
        content:
          "Excellent travail ! 🎉\n\n**Tests réussis :**\n- ✅ Structure HTML\n- ✅ Grille de photos\n- ✅ Interactivité des images\n\n**Prochaine étape :** J'ai oublié de préciser, j'aimerais aussi un **formulaire de contact** (Nom, Email, Message) juste au-dessus du pied de page. Peux-tu l'ajouter ?",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, feedbackMessage]);
    }, 15000);
  };

  return (
    <div className="flex h-full flex-col">
      {/* En-tête avec avatar du client */}
      <div className="flex items-center gap-3 border-b border-border bg-secondary p-4">
        <Avatar>
          <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Chloe" />
          <AvatarFallback>CD</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h3 className="font-semibold">Chloé Dubois</h3>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <div className="h-2 w-2 rounded-full bg-green-500" />
            <span>En ligne</span>
          </div>
        </div>
      </div>

      {/* Onglets */}
      <div className="flex border-b border-border">
        <button
          onClick={() => setActiveTab('brief')}
          className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'brief'
              ? 'border-b-2 border-primary text-foreground'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Brief & Objectifs
        </button>
        <button
          onClick={() => setActiveTab('chat')}
          className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'chat'
              ? 'border-b-2 border-primary text-foreground'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Chat Client
        </button>
      </div>

      {/* Contenu */}
      <div className="flex-1 overflow-auto p-4">
        {activeTab === 'brief' && (
          <div className="space-y-4">
            <div>
              <h4 className="mb-2 font-semibold">Description du Projet</h4>
              <p className="text-sm text-muted-foreground">
                Créer un site portfolio pour une photographe professionnelle avec une galerie
                interactive et un formulaire de contact.
              </p>
            </div>

            <div>
              <h4 className="mb-3 font-semibold">Objectifs à Valider</h4>
              <div className="space-y-2">
                {objectives.map((objective) => (
                  <div key={objective.id} className="flex items-start gap-2">
                    {objective.completed ? (
                      <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-500" />
                    ) : (
                      <Circle className="mt-0.5 h-5 w-5 flex-shrink-0 text-muted-foreground" />
                    )}
                    <span
                      className={`text-sm ${
                        objective.completed ? 'text-muted-foreground line-through' : ''
                      }`}
                    >
                      {objective.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'chat' && (
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-lg px-4 py-2 ${
                    message.sender === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary text-foreground'
                  }`}
                >
                  <ReactMarkdown className="prose prose-sm dark:prose-invert">
                    {message.content}
                  </ReactMarkdown>
                  <p className="mt-1 text-xs opacity-70">
                    {message.timestamp.toLocaleTimeString('fr-FR', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Zone d'action */}
      <div className="border-t border-border p-4">
        {activeTab === 'chat' ? (
          <div className="flex gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Envoyer un message..."
              className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
            <button
              onClick={handleSendMessage}
              className="rounded-md bg-primary p-2 text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
        ) : (
          <button
            onClick={handleSubmitProject}
            disabled={isSubmitting}
            className="w-full rounded-md bg-primary py-3 font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin" />
                Analyse en cours...
              </span>
            ) : (
              'Soumettre pour validation'
            )}
          </button>
        )}
      </div>
    </div>
  );
}
