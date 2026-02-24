import { useState, useEffect } from 'react';
import { useAdmin } from '@/context/AdminContext';
import { toast } from 'sonner';
import { Save, User, Plus, Trash2, GripVertical } from 'lucide-react';
import type { AboutCard } from '@/types';

export function AboutEditor() {
  const { data, updateAbout } = useAdmin();
  const [cards, setCards] = useState<AboutCard[]>(data.about.cards);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    setCards(data.about.cards);
  }, [data.about.cards]);

  const handleCardChange = (index: number, field: keyof AboutCard, value: string) => {
    setCards((prev) =>
      prev.map((card, i) => (i === index ? { ...card, [field]: value } : card))
    );
    setHasChanges(true);
  };

  const handleAddCard = () => {
    if (cards.length >= 5) {
      toast.error('Maximum 5 cards allowed');
      return;
    }
    const newCard: AboutCard = {
      id: Date.now().toString(),
      title: 'New Card',
      content: 'Card content...',
      bgColor: 'dark',
    };
    setCards([...cards, newCard]);
    setHasChanges(true);
  };

  const handleDeleteCard = (index: number) => {
    if (cards.length <= 1) {
      toast.error('At least one card is required');
      return;
    }
    setCards(cards.filter((_, i) => i !== index));
    setHasChanges(true);
  };

  const handleSave = () => {
    updateAbout({ cards });
    setHasChanges(false);
    toast.success('About section updated successfully');
  };

  const bgColorOptions = [
    { value: 'white', label: 'White', class: 'bg-white text-[#0F0F0F]' },
    { value: 'dark', label: 'Dark', class: 'bg-[#1A1A1A] text-white' },
    { value: 'blue', label: 'Blue', class: 'bg-[#3B82F6] text-white' },
  ];

  return (
    <div className="max-w-3xl">
      <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#3B82F6]/10 flex items-center justify-center">
              <User className="w-5 h-5 text-[#3B82F6]" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">About Cards</h2>
              <p className="text-[#666] text-sm">Manage your about section cards</p>
            </div>
          </div>
          <button
            onClick={handleAddCard}
            className="flex items-center gap-2 px-4 py-2 bg-[#3B82F6] text-white rounded-lg hover:bg-[#2563EB] transition-colors text-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Add Card</span>
          </button>
        </div>

        <div className="space-y-6">
          {cards.map((card, index) => (
            <div
              key={card.id}
              className="bg-[#0F0F0F] border border-[#2A2A2A] rounded-lg p-4"
            >
              <div className="flex items-start gap-4">
                <div className="mt-2 text-[#666]">
                  <GripVertical className="w-5 h-5" />
                </div>

                <div className="flex-1 space-y-4">
                  {/* Title */}
                  <div>
                    <label className="block text-[#A0A0A0] text-xs mb-1">Card Title</label>
                    <input
                      type="text"
                      value={card.title}
                      onChange={(e) => handleCardChange(index, 'title', e.target.value)}
                      className="w-full bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#3B82F6] transition-colors"
                    />
                  </div>

                  {/* Content */}
                  <div>
                    <label className="block text-[#A0A0A0] text-xs mb-1">Card Content</label>
                    <textarea
                      value={card.content}
                      onChange={(e) => handleCardChange(index, 'content', e.target.value)}
                      rows={3}
                      className="w-full bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#3B82F6] transition-colors resize-none"
                    />
                  </div>

                  {/* Background Color */}
                  <div>
                    <label className="block text-[#A0A0A0] text-xs mb-2">Background Style</label>
                    <div className="flex gap-2">
                      {bgColorOptions.map((option) => (
                        <button
                          key={option.value}
                          onClick={() =>
                            handleCardChange(index, 'bgColor', option.value as AboutCard['bgColor'])
                          }
                          className={`px-4 py-2 rounded-lg text-sm border transition-colors ${
                            card.bgColor === option.value
                              ? 'border-[#3B82F6] bg-[#3B82F6]/10'
                              : 'border-[#2A2A2A] hover:border-[#3B82F6]/50'
                          }`}
                        >
                          <span className={option.class}>{option.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleDeleteCard(index)}
                  className="mt-2 p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Save button */}
        <div className="mt-6 pt-6 border-t border-[#2A2A2A]">
          <button
            onClick={handleSave}
            disabled={!hasChanges}
            className="flex items-center gap-2 px-6 py-3 bg-[#3B82F6] text-white rounded-lg hover:bg-[#2563EB] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-5 h-5" />
            <span>Save Changes</span>
          </button>
        </div>
      </div>
    </div>
  );
}
