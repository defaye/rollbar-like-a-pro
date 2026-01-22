export interface Preset {
  id: string;
  text: string;
}

export interface PresetConfig {
  presets: Preset[];
}

export const DEFAULT_PRESETS: Preset[] = [
  {
    id: '1',
    text: "Let's see if it happens again.",
  },
  {
    id: '2',
    text: 'Not frequent, leaving open to accumulate.',
  },
  {
    id: '3',
    text: 'Further investigation needed.',
  },
  {
    id: '4',
    text: 'JID #{request.params.jid} completed successfully.',
  },
  {
    id: '5',
    text: 'JID #{request.params.jid} is retrying.',
  },
  {
    id: '6',
    text: "Probably not our code. It looks like it may be coming from an extension. Leaving open.",
  },
];
