"use client";

import { useState, useMemo, ReactNode } from "react";

interface Emoji {
  emoji: string;
  name: string;
}

const POPULAR_EMOJIS: Emoji[] = [
  { emoji: "😀", name: "Grinning" },
  { emoji: "😃", name: "Happy" },
  { emoji: "😄", name: "Smile" },
  { emoji: "😁", name: "Beam" },
  { emoji: "😆", name: "Laughing" },
  { emoji: "😅", name: "Sweat" },
  { emoji: "🤣", name: "ROFL" },
  { emoji: "😂", name: "Joy" },
  { emoji: "🙂", name: "Slight smile" },
  { emoji: "🙃", name: "Upside down" },
  { emoji: "😉", name: "Wink" },
  { emoji: "😊", name: "Blush" },
  { emoji: "😇", name: "Innocent" },
  { emoji: "🥰", name: "Hearts" },
  { emoji: "😍", name: "Heart eyes" },
  { emoji: "🤩", name: "Starstruck" },
  { emoji: "😘", name: "Kiss" },
  { emoji: "😗", name: "Kissing" },
  { emoji: "😚", name: "Kiss closed eyes" },
  { emoji: "😙", name: "Kiss smile" },
  { emoji: "🥲", name: "Tear joy" },
  { emoji: "😋", name: "Yummy" },
  { emoji: "😛", name: "Tongue" },
  { emoji: "😜", name: "Wink tongue" },
  { emoji: "🤪", name: "Crazy" },
  { emoji: "😝", name: "Squint tongue" },
  { emoji: "🤑", name: "Money" },
  { emoji: "🤗", name: "Hug" },
  { emoji: "🤭", name: "Hand over mouth" },
  { emoji: "🤫", name: "Shush" },
  { emoji: "🤔", name: "Thinking" },
  { emoji: "🤐", name: "Zipper mouth" },
  { emoji: "🤨", name: "Raised eyebrow" },
  { emoji: "😐", name: "Neutral" },
  { emoji: "😑", name: "Expressionless" },
  { emoji: "😶", name: "No mouth" },
  { emoji: "😏", name: "Smirk" },
  { emoji: "😒", name: "Unamused" },
  { emoji: "🙄", name: "Eye roll" },
  { emoji: "😬", name: "Grimace" },
  { emoji: "😮‍💨", name: " exhale" },
  { emoji: "🤥", name: "Liar" },
  { emoji: "😌", name: "Relieved" },
  { emoji: "😔", name: "Pensive" },
  { emoji: "😪", name: "Sleepy" },
  { emoji: "🤤", name: "Drool" },
  { emoji: "😴", name: "Sleeping" },
  { emoji: "😷", name: "Sick" },
  { emoji: "🤒", name: "Fever" },
  { emoji: "🤕", name: "Hurt" },
  { emoji: "🤢", name: "Nauseous" },
  { emoji: "🤮", name: "Vomit" },
  { emoji: "🤧", name: "Sneeze" },
  { emoji: "🥵", name: "Hot" },
  { emoji: "🥶", name: "Cold" },
  { emoji: "🥴", name: "Woozy" },
  { emoji: "😵", name: "Dizzy" },
  { emoji: "🤯", name: "Mind blown" },
  { emoji: "🤠", name: "Cowboy" },
  { emoji: "🥳", name: "Party" },
  { emoji: "🥸", name: "Disguised" },
  { emoji: "😎", name: "Cool" },
  { emoji: "🤓", name: "Nerd" },
  { emoji: "🧐", name: "Monocle" },
  { emoji: "😕", name: "Confused" },
  { emoji: "😟", name: "Worried" },
  { emoji: "🙁", name: "Slight frown" },
  { emoji: "☹️", name: "Frowning" },
  { emoji: "😮", name: "Wow" },
  { emoji: "😯", name: "Hushed" },
  { emoji: "😲", name: "Astonished" },
  { emoji: "😳", name: "Flushed" },
  { emoji: "🥺", name: "Pleading" },
  { emoji: "😦", name: "Frowning open" },
  { emoji: "😧", name: "Anguished" },
  { emoji: "😨", name: "Fearful" },
  { emoji: "😰", name: "Anxious" },
  { emoji: "😥", name: "Sad relieved" },
  { emoji: "😢", name: "Crying" },
  { emoji: "😭", name: "Sobbing" },
  { emoji: "😱", name: "Scream" },
  { emoji: "😖", name: "Confounded" },
  { emoji: "😣", name: "Enduring" },
  { emoji: "😞", name: "Disappointed" },
  { emoji: "😓", name: "Downcast" },
  { emoji: "😩", name: "Weary" },
  { emoji: "😫", name: "Tired" },
  { emoji: "🥱", name: "Yawn" },
  { emoji: "😤", name: "Steam" },
  { emoji: "😡", name: "Pout" },
  { emoji: "😠", name: "Angry" },
  { emoji: "🤬", name: "Cursing" },
  { emoji: "😈", name: "Devil" },
  { emoji: "👿", name: "Angry devil" },
  { emoji: "💀", name: "Skull" },
  { emoji: "☠️", name: "Skull crossbones" },
  { emoji: "💩", name: "Poop" },
  { emoji: "🤡", name: "Clown" },
  { emoji: "👹", name: "Ogre" },
  { emoji: "👺", name: "Goblin" },
  { emoji: "👻", name: "Ghost" },
  { emoji: "👽", name: "Alien" },
  { emoji: "👾", name: "Alien monster" },
  { emoji: "🤖", name: "Robot" },
  { emoji: "😺", name: "Cat smile" },
  { emoji: "😸", name: "Cat joy" },
  { emoji: "😹", name: "Cat tears" },
  { emoji: "😻", name: "Cat heart" },
  { emoji: "😼", name: "Cat smirk" },
  { emoji: "😽", name: "Cat kiss" },
  { emoji: "🙀", name: "Cat weary" },
  { emoji: "😿", name: "Cat cry" },
  { emoji: "😾", name: "Cat pout" },
  { emoji: "🙈", name: "See no evil" },
  { emoji: "🙉", name: "Hear no evil" },
  { emoji: "🙊", name: "Speak no evil" },
  { emoji: "💋", name: "Kiss mark" },
  { emoji: "💌", name: "Love letter" },
  { emoji: "💘", name: "Cupid" },
  { emoji: "💝", name: "Gift heart" },
  { emoji: "💖", name: "Sparkle heart" },
  { emoji: "💗", name: "Growing heart" },
  { emoji: "💓", name: "Beating heart" },
  { emoji: "💞", name: "Revolving hearts" },
  { emoji: "💕", name: "Two hearts" },
  { emoji: "💟", name: "Heart decoration" },
  { emoji: "❣️", name: "Heart exclamation" },
  { emoji: "💔", name: "Broken heart" },
  { emoji: "❤️", name: "Red heart" },
  { emoji: "🧡", name: "Orange heart" },
  { emoji: "💛", name: "Yellow heart" },
  { emoji: "💚", name: "Green heart" },
  { emoji: "💙", name: "Blue heart" },
  { emoji: "💜", name: "Purple heart" },
  { emoji: "🤎", name: "Brown heart" },
  { emoji: "🖤", name: "Black heart" },
  { emoji: "🤍", name: "White heart" },
  { emoji: "💯", name: "100" },
  { emoji: "💢", name: "Anger" },
  { emoji: "💥", name: "Collision" },
  { emoji: "💫", name: "Dizzy" },
  { emoji: "💦", name: "Sweat drops" },
  { emoji: "💨", name: "Dash" },
  { emoji: "🕳️", name: "Hole" },
  { emoji: "💣", name: "Bomb" },
  { emoji: "💬", name: "Speech" },
  { emoji: "👋", name: "Wave" },
  { emoji: "🤚", name: "Raised hand" },
  { emoji: "🖐️", name: "Fingers splayed" },
  { emoji: "✋", name: "Hand" },
  { emoji: "🖖", name: "Vulcan" },
  { emoji: "👌", name: "OK" },
  { emoji: "🤌", name: "Pinched" },
  { emoji: "🤏", name: "Pinching" },
  { emoji: "✌️", name: "Victory" },
  { emoji: "🤞", name: "Crossed fingers" },
  { emoji: "🤟", name: "Love you" },
  { emoji: "🤘", name: "Horns" },
  { emoji: "🤙", name: "Call me" },
  { emoji: "👈", name: "Point left" },
  { emoji: "👉", name: "Point right" },
  { emoji: "👆", name: "Point up" },
  { emoji: "🖕", name: "Middle finger" },
  { emoji: "👇", name: "Point down" },
  { emoji: "☝️", name: "Point up 2" },
  { emoji: "👍", name: "Thumbs up" },
  { emoji: "👎", name: "Thumbs down" },
  { emoji: "✊", name: "Fist" },
  { emoji: "👊", name: "Oncoming fist" },
  { emoji: "🤛", name: "Fist left" },
  { emoji: "🤜", name: "Fist right" },
  { emoji: "👏", name: "Clap" },
  { emoji: "🙌", name: "Raising hands" },
  { emoji: "👐", name: "Open hands" },
  { emoji: "🤲", name: "Palms up" },
  { emoji: "🤝", name: "Handshake" },
  { emoji: "🙏", name: "Please" },
  { emoji: "✍️", name: "Write" },
  { emoji: "💅", name: "Nail polish" },
  { emoji: "🤳", name: "Selfie" },
  { emoji: "💪", name: "Muscle" },
  { emoji: "🔥", name: "Fire" },
  { emoji: "⭐", name: "Star" },
  { emoji: "🌟", name: "Glowing star" },
  { emoji: "✨", name: "Sparkles" },
  { emoji: "⚡", name: "Lightning" },
  { emoji: "☄️", name: "Comet" },
  { emoji: "🌈", name: "Rainbow" },
  { emoji: "🌊", name: "Wave" },
  { emoji: "🎉", name: "Party" },
  { emoji: "🎊", name: "Confetti" },
  { emoji: "🎈", name: "Balloon" },
  { emoji: "🎁", name: "Gift" },
  { emoji: "🏆", name: "Trophy" },
  { emoji: "🥇", name: "Gold medal" },
  { emoji: "🥈", name: "Silver medal" },
  { emoji: "🥉", name: "Bronze medal" },
  { emoji: "🏅", name: "Sports medal" },
  { emoji: "🏳️‍🌈", name: "Gay" },
  { emoji: "🇨🇺", name: "Cuba" },
  { emoji: "🇺🇸", name: "USA" },
  { emoji: "🇪🇸", name: "Spain" },
  { emoji: "🇲🇽", name: "Mexico" },
  { emoji: "🇦🇷", name: "Argentina" },
  { emoji: "🇧🇷", name: "Brazil" },
  { emoji: "🇨🇴", name: "Colombia" },
  { emoji: "🇻🇪", name: "Venezuela" },
  { emoji: "🇵🇪", name: "Peru" },
  { emoji: "🇨🇱", name: "Chile" },
  { emoji: "🇬🇧", name: "UK" },
  { emoji: "🇫🇷", name: "France" },
  { emoji: "🇩🇪", name: "Germany" },
  { emoji: "🇮🇹", name: "Italy" },
  { emoji: "🇵🇹", name: "Portugal" },
  { emoji: "🇷🇺", name: "Russia" },
  { emoji: "🇨🇳", name: "China" },
  { emoji: "🇯🇵", name: "Japan" },
  { emoji: "🇰🇷", name: "South Korea" },
  { emoji: "🇮🇳", name: "India" },
  { emoji: "🇨🇦", name: "Canada" },
  { emoji: "🇦🇺", name: "Australia" },
];

const EMOJIS_PER_PAGE = 60;

interface EmojiPickerDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (emoji: string) => void;
  children: ReactNode;
}

export function EmojiPickerDialog({ isOpen, onClose, onSelect, children }: EmojiPickerDialogProps) {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      <div className="absolute inset-0 backdrop-blur-sm bg-black/30" />
      <div 
        className="relative z-10 bg-white dark:bg-zinc-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-zinc-700 p-4 max-w-sm w-full mx-4 max-h-96 overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}

interface EmojiGridProps {
  onSelect: (emoji: string) => void;
}

export function EmojiGrid({ onSelect }: EmojiGridProps) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const filteredEmojis = useMemo(() => {
    if (!search.trim()) return POPULAR_EMOJIS;
    const query = search.toLowerCase();
    return POPULAR_EMOJIS.filter(e => e.name.toLowerCase().includes(query));
  }, [search]);

  const totalPages = Math.ceil(filteredEmojis.length / EMOJIS_PER_PAGE);
  const visibleEmojis = filteredEmojis.slice(0, page * EMOJIS_PER_PAGE);

  return (
    <>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-200">Pick an emoji</h3>
      </div>
      
      <div className="relative mb-3">
        <input
          type="text"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          placeholder="Search emoji..."
          className="w-full px-3 py-2 pl-9 text-sm rounded-lg bg-gray-100 dark:bg-zinc-700 border border-gray-200 dark:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-violet-500 text-gray-800 dark:text-white placeholder-gray-400"
        />
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-violet-400 scrollbar-track-transparent hover:scrollbar-thumb-violet-500">
        <div className="grid grid-cols-8 gap-1">
          {visibleEmojis.map((item) => (
            <button
              key={item.emoji}
              onClick={() => onSelect(item.emoji)}
              title={item.name}
              className="w-9 h-9 flex items-center justify-center text-xl hover:bg-gray-100 dark:hover:bg-zinc-700 rounded-lg transition-colors hover:scale-110"
            >
              {item.emoji}
            </button>
          ))}
        </div>
      </div>

      {filteredEmojis.length > visibleEmojis.length && (
        <div className="mt-2 pt-2 border-t border-gray-200 dark:border-zinc-700">
          <button
            onClick={() => setPage(p => p + 1)}
            className="w-full py-2 text-sm text-violet-600 dark:text-violet-400 hover:bg-gray-100 dark:hover:bg-zinc-700 rounded-lg transition-colors"
          >
            Load more ({filteredEmojis.length - visibleEmojis.length} remaining)
          </button>
        </div>
      )}
    </>
  );
}
