import { atom } from 'recoil';

interface FocusedTextSegment {
  id: string | null;
}

//const initialFocusedTextSegments: FocusedTextSegment[] = [];

//export const focusedTextSegments = atom({
//key: 'focusedTextSegments',
//default: initialFocusedTextSegments,
//});

const initialCurrentFocus: FocusedTextSegment = { id: null };

export const currentFocus = atom({
  key: 'currentFocus',
  default: initialCurrentFocus,
});
