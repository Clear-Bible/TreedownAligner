import {
  Word,
  Alignment,
  AlignmentSide,
  PrimaryAlignmentPolarity,
} from 'structs';

import alignmentSliceReducer, {
  createLink,
  deleteLink,
  toggleTextSegment,
  initialState,
  AlignmentMode,
} from 'state/alignment.slice';

const englishAlignment: Alignment = {
  source: 'sbl',
  target: 'leb',
  links: [],
  polarity: {
    type: 'primary',
    syntaxSide: 'sources',
    nonSyntaxSide: 'targets',
  },
};
const spanishAlignment: Alignment = {
  source: 'sbl',
  target: 'nvi',
  links: [],
  polarity: {
    type: 'primary',
    syntaxSide: 'sources',
    nonSyntaxSide: 'targets',
  },
};

const sourceWord1: Word = {
  id: 'sbl_0',
  corpusId: 'sbl',
  text: '',
  position: 0,
};
const sourceWord2: Word = {
  id: 'sbl_1',
  corpusId: 'sbl',
  text: '',
  position: 1,
};

const targetWord1: Word = {
  id: 'leb_1',
  corpusId: 'leb',
  text: '',
  position: 1,
};
const targetWord2: Word = {
  id: 'leb_2',
  corpusId: 'leb',
  text: '',
  position: 2,
};

const otherTargetWord1: Word = {
  id: 'nvi_1',
  corpusId: 'nvi',
  text: '',
  position: 1,
};

describe('alignmentSlice reducer', () => {
  describe('toggleTextSegment', () => {
    it('selects a single unselected segment', () => {
      const previousState = {
        ...initialState,
        alignments: [englishAlignment],
        inProgressLink: null,
      };
      const resultState = alignmentSliceReducer(
        previousState,
        toggleTextSegment(targetWord1)
      );

      expect(resultState.inProgressLink).toEqual({
        _id: 'sbl-leb-0',
        source: 'sbl',
        target: 'leb',
        sources: [],
        targets: ['leb_1'],
      });
    });

    it('deselects a single selected segment', () => {
      const previousState = {
        ...initialState,
        alignments: [englishAlignment],
        inProgressLink: {
          _id: 'sbl-leb-0',
          source: 'sbl',
          target: 'leb',
          sources: [],
          targets: ['leb_1'],
        },
      };
      const resultState = alignmentSliceReducer(
        previousState,
        toggleTextSegment(targetWord1)
      );

      // When the last selected segment has been untoggled,
      // for now the desired behavior is to go back to clean slate.
      expect(resultState.inProgressLink).toBeNull();
    });

    it('deselects a single selected segment (others remaining)', () => {
      const previousState = {
        ...initialState,
        alignments: [englishAlignment],
        inProgressLink: {
          _id: 'sbl-leb-0',
          source: 'sbl',
          target: 'leb',
          sources: ['sbl_0'],
          targets: ['leb_1', 'leb_2'],
        },
      };
      const resultState = alignmentSliceReducer(
        previousState,
        toggleTextSegment(targetWord1)
      );

      expect(resultState.inProgressLink).toEqual({
        _id: 'sbl-leb-0',
        source: 'sbl',
        target: 'leb',
        sources: ['sbl_0'],
        targets: ['leb_2'],
      });
    });

    it('deselects a single selected segment (only source remains)', () => {
      const previousState = {
        ...initialState,
        alignments: [englishAlignment],
        inProgressLink: {
          _id: 'sbl-leb-0',
          source: 'sbl',
          target: 'leb',
          sources: ['sbl_0'],
          targets: ['leb_1'],
        },
      };
      const resultState = alignmentSliceReducer(
        previousState,
        toggleTextSegment(targetWord1)
      );

      expect(resultState.inProgressLink).toEqual({
        _id: 'sbl-leb-0',
        source: 'sbl',
        target: 'leb',
        sources: ['sbl_0'],
        targets: [],
      });
    });

    it('deselects a single selected segment (only target remains)', () => {
      const previousState = {
        ...initialState,
        alignments: [englishAlignment],
        inProgressLink: {
          _id: 'sbl-leb-0',
          source: 'sbl',
          target: 'leb',
          sources: ['sbl_0'],
          targets: ['leb_1'],
        },
      };
      const resultState = alignmentSliceReducer(
        previousState,
        toggleTextSegment(sourceWord1)
      );

      expect(resultState.inProgressLink).toEqual({
        _id: 'sbl-leb-0',
        source: 'sbl',
        target: 'leb',
        sources: [],
        targets: ['leb_1'],
      });
    });
    it('selects a target segment (only source previously)', () => {
      const previousState = {
        ...initialState,
        alignments: [englishAlignment],
        inProgressLink: {
          _id: 'sbl-leb-0',
          source: 'sbl',
          target: 'leb',
          sources: ['sbl_0'],
          targets: [],
        },
      };
      const resultState = alignmentSliceReducer(
        previousState,
        toggleTextSegment(targetWord1)
      );

      expect(resultState.inProgressLink).toEqual({
        _id: 'sbl-leb-0',
        source: 'sbl',
        target: 'leb',
        sources: ['sbl_0'],
        targets: ['leb_1'],
      });
    });

    it('selects a source segment (only target previously)', () => {
      const previousState = {
        ...initialState,
        alignments: [englishAlignment],
        inProgressLink: {
          _id: 'sbl-leb-0',
          source: 'sbl',
          target: 'leb',
          sources: [],
          targets: ['leb_1'],
        },
      };
      const resultState = alignmentSliceReducer(
        previousState,
        toggleTextSegment(sourceWord1)
      );

      expect(resultState.inProgressLink).toEqual({
        _id: 'sbl-leb-0',
        source: 'sbl',
        target: 'leb',
        sources: ['sbl_0'],
        targets: ['leb_1'],
      });
    });

    it('enters select mode (from blank slate)', () => {
      const previousState = {
        ...initialState,
        alignments: [
          {
            source: 'sbl',
            target: 'leb',
            links: [
              { _id: 'sbl-leb-1', sources: ['sbl_0'], targets: ['leb_1'] },
            ],
            polarity: {
              type: 'primary',
              syntaxSide: 'sources',
              nonSyntaxSide: 'targets',
            } as PrimaryAlignmentPolarity,
          },
        ],
        inProgressLink: null,
      };

      const resultState = alignmentSliceReducer(
        previousState,
        toggleTextSegment(targetWord1)
      );

      expect(resultState.mode).toEqual(AlignmentMode.Select);
    });

    it('enters edit mode (from select)', () => {
      const previousState = {
        ...initialState,
        alignments: [
          {
            source: 'sbl',
            target: 'leb',
            links: [
              { _id: 'sbl-leb-1', sources: ['sbl_0'], targets: ['leb_1'] },
            ],
            polarity: {
              type: 'primary',
              syntaxSide: 'sources',
              nonSyntaxSide: 'targets',
            } as PrimaryAlignmentPolarity,
          },
        ],
        inProgressLink: {
          _id: 'sbl-leb-1',
          source: 'sbl',
          target: 'leb',
          sources: ['sbl_0'],
          targets: ['leb_1'],
        },
      };

      const resultState = alignmentSliceReducer(
        previousState,
        toggleTextSegment(targetWord2)
      );

      expect(resultState.mode).toEqual(AlignmentMode.Edit);
    });

    it('enters edit mode (from clean) for non-ambigious alignments', () => {
      const previousState = {
        ...initialState,
        alignments: [
          {
            source: 'sbl',
            target: 'nvi',
            links: [
              { _id: 'sbl-nvi-1', sources: ['sbl_0'], targets: ['nvi_1'] },
            ],
            polarity: {
              type: 'primary',
              syntaxSide: 'sources',
              nonSyntaxSide: 'targets',
            } as PrimaryAlignmentPolarity,
          },
          {
            source: 'nvi',
            target: 'leb',
            links: [
              { _id: 'nvi-leb-1', sources: ['nvi_1'], targets: ['leb_3'] },
            ],
            polarity: {
              type: 'primary',
              syntaxSide: 'sources',
              nonSyntaxSide: 'targets',
            } as PrimaryAlignmentPolarity,
          },
        ],
        inProgressLink: null,
      };

      const resultState = alignmentSliceReducer(
        previousState,
        toggleTextSegment({
          id: 'leb_4',
          corpusId: 'leb',
          text: 'some word',
          position: 4,
        })
      );

      expect(resultState.inProgressLink).toBeTruthy();
      expect(resultState.inProgressLink?._id).toEqual('nvi-leb-2');
      expect(resultState.mode).toEqual(AlignmentMode.Edit);
    });

    it('enters partial edit mode (from clean, ambiguous)', () => {
      const previousState = {
        ...initialState,
        alignments: [
          {
            source: 'sbl',
            target: 'nvi',
            links: [
              { _id: 'sbl-nvi-1', sources: ['sbl_0'], targets: ['nvi_1'] },
            ],
            polarity: {
              type: 'primary',
              syntaxSide: 'sources',
              nonSyntaxSide: 'targets',
            } as PrimaryAlignmentPolarity,
          },
          {
            source: 'nvi',
            target: 'leb',
            links: [
              { _id: 'nvi-leb-1', sources: ['nvi_1'], targets: ['leb_3'] },
            ],
            polarity: {
              type: 'primary',
              syntaxSide: 'sources',
              nonSyntaxSide: 'targets',
            } as PrimaryAlignmentPolarity,
          },
        ],
        inProgressLink: null,
      };

      try {
        const resultState = alignmentSliceReducer(
          previousState,
          toggleTextSegment({
            id: 'nvi_6',
            corpusId: 'nvi',
            text: 'some word',
            position: 6,
          })
        );
      } catch (error) {
        if (error instanceof Error) {
          expect(error.message).toEqual(
            'DISAMBIGUATE POTENTIAL ALIGNMENTS? Not implemented yet.'
          );
        }
      }

      // expect(resultState.inProgressLink).toBeTruthy();
      // expect(resultState.inProgressLink?._id).toEqual('?');
      // expect(resultState.mode).toEqual(AlignmentMode.PartialEdit);
    });

    it('enters edit mode (from partial edit)', () => {
      const previousState = {
        ...initialState,
        alignments: [
          {
            source: 'nvi',
            target: 'sbl',
            links: [
              { _id: 'nvi-sbl-1', sources: ['nvi_0'], targets: ['sbl_1'] },
            ],
            polarity: {
              type: 'primary',
              syntaxSide: 'sources',
              nonSyntaxSide: 'targets',
            } as PrimaryAlignmentPolarity,
          },
        ],
      };

      const resultState = alignmentSliceReducer(
        previousState,
        toggleTextSegment({
          id: 'sbl_2',
          corpusId: 'sbl',
          // role: CorpusRole.Target,
          text: 'asdf',
          position: 3,
        })
      );

      expect(resultState.inProgressLink?._id).toEqual('nvi-sbl-2');
      expect(resultState.mode).toEqual(AlignmentMode.Edit);
    });
  });

  describe('createLink', () => {
    it('adds first link based on selected text segments (sbl => leb)', () => {
      const previousState = {
        ...initialState,
        alignments: [englishAlignment],
        inProgressLink: {
          _id: 'sbl-leb-0',
          source: 'sbl',
          target: 'leb',
          sources: ['sbl_1'],
          targets: ['leb_1'],
        },
        //[sourceWord2, targetWord1],
      };

      const resultState = alignmentSliceReducer(previousState, createLink());

      expect(resultState.alignments[0].links.length).toBe(1);
      expect(resultState.alignments[0].source).toBe('sbl');
      expect(resultState.alignments[0].target).toBe('leb');
      expect(resultState.alignments[0].links[0]).toEqual({
        _id: 'sbl-leb-0',
        sources: ['sbl_1'],
        targets: ['leb_1'],
      });
    });

    it('adds first link based on selected text segments (sbl => nvi)', () => {
      const previousState = {
        ...initialState,
        alignments: [spanishAlignment],
        inProgressLink: {
          _id: 'sbl-nvi-1',
          source: 'sbl',
          target: 'nvi',
          sources: ['sbl_1'],
          targets: ['nvi_1'],
        },
      };

      const resultState = alignmentSliceReducer(previousState, createLink());

      expect(resultState.alignments[0].links.length).toBe(1);
      expect(resultState.alignments[0].source).toBe('sbl');
      expect(resultState.alignments[0].target).toBe('nvi');
      expect(resultState.alignments[0].links[0]).toEqual({
        _id: 'sbl-nvi-1',
        sources: ['sbl_1'],
        targets: ['nvi_1'],
      });
    });

    it('adds a segment to an existing link', () => {
      const previousState = {
        ...initialState,
        alignments: [
          {
            source: 'sbl',
            target: 'leb',
            links: [
              { _id: 'sbl-leb-1', sources: ['sbl_0'], targets: ['leb_1'] },
            ],
            polarity: {
              type: 'primary',
              syntaxSide: 'sources',
              nonSyntaxSide: 'targets',
            } as PrimaryAlignmentPolarity,
          },
        ],
        inProgressLink: {
          _id: 'sbl-leb-1',
          source: 'sbl',
          target: 'leb',
          sources: ['sbl_0'],
          targets: ['leb_1', 'leb_2'],
        },
      };

      const resultState = alignmentSliceReducer(previousState, createLink());

      expect(resultState.alignments[0].links.length).toBe(1);
      expect(resultState.alignments[0].source).toBe('sbl');
      expect(resultState.alignments[0].target).toBe('leb');
      expect(resultState.alignments[0].links[0]).toEqual({
        _id: 'sbl-leb-1',
        sources: ['sbl_0'],
        targets: ['leb_1', 'leb_2'],
      });
    });

    it('removes a segment to an existing link', () => {
      const previousState = {
        ...initialState,
        alignments: [
          {
            source: 'sbl',
            target: 'leb',
            links: [
              {
                _id: 'sbl-leb-1',
                sources: ['sbl_0'],
                targets: ['leb_1', 'leb_2'],
              },
            ],
            polarity: {
              type: 'primary',
              syntaxSide: 'sources',
              nonSyntaxSide: 'targets',
            } as PrimaryAlignmentPolarity,
          },
        ],
        inProgressLink: {
          _id: 'sbl-leb-1',
          source: 'sbl',
          target: 'leb',
          sources: ['sbl_0'],
          targets: ['leb_1'],
        },
      };

      const resultState = alignmentSliceReducer(previousState, createLink());

      expect(resultState.alignments[0].links.length).toBe(1);
      expect(resultState.alignments[0].source).toBe('sbl');
      expect(resultState.alignments[0].target).toBe('leb');
      expect(resultState.alignments[0].links[0]).toEqual({
        _id: 'sbl-leb-1',
        sources: ['sbl_0'],
        targets: ['leb_1'],
      });
    });
  });

  describe('deleteLink', () => {
    it('does nothing when there is no inProgressLink', () => {
      const previousState = {
        ...initialState,
        alignments: [
          {
            source: 'sbl',
            target: 'leb',
            links: [
              {
                _id: 'sbl-leb-1',
                sources: ['sbl_0'],
                targets: ['leb_1', 'leb_2'],
              },
            ],
            polarity: {
              type: 'primary',
              syntaxSide: 'sources',
              nonSyntaxSide: 'targets',
            } as PrimaryAlignmentPolarity,
          },
        ],
      };

      const resultState = alignmentSliceReducer(previousState, deleteLink());

      expect(resultState).toEqual(previousState);
    });

    it('deletes a matching link', () => {
      const previousState = {
        ...initialState,
        alignments: [
          {
            source: 'sbl',
            target: 'leb',
            links: [
              {
                _id: 'sbl-leb-1',
                sources: ['sbl_0'],
                targets: ['leb_1', 'leb_2'],
              },
            ],
            polarity: {
              type: 'primary',
              syntaxSide: 'sources',
              nonSyntaxSide: 'targets',
            } as PrimaryAlignmentPolarity,
          },
        ],
        inProgressLink: {
          _id: 'sbl-leb-1',
          source: 'sbl',
          target: 'leb',
          sources: ['sbl_0'],
          targets: ['leb_1'],
        },
      };

      const resultState = alignmentSliceReducer(previousState, deleteLink());

      expect(resultState.inProgressLink).toEqual(null);
      expect(resultState.alignments[0].links).toEqual([]);
      expect(resultState.mode).toEqual(AlignmentMode.CleanSlate);
    });

    it('deletes a link that only matches ID', () => {
      const previousState = {
        ...initialState,
        alignments: [
          {
            source: 'sbl',
            target: 'leb',
            links: [
              {
                _id: 'sbl-leb-1',
                sources: ['sbl_0'],
                targets: ['leb_1'],
              },

              {
                _id: 'sbl-leb-2',
                sources: ['sbl_3'],
                targets: ['leb_1', 'leb_2'],
              },

              {
                _id: 'sbl-leb-8',
                sources: ['sbl_7'],
                targets: ['leb_3', 'leb_8'],
              },
            ],
            polarity: {
              type: 'primary',
              syntaxSide: 'sources',
              nonSyntaxSide: 'targets',
            } as PrimaryAlignmentPolarity,
          },
        ],

        inProgressLink: {
          _id: 'sbl-leb-1',
          source: 'sbl',
          target: 'leb',
          sources: ['sbl_0'],
          targets: ['leb_1'],
        },
      };

      const resultState = alignmentSliceReducer(previousState, deleteLink());

      expect(resultState.inProgressLink).toEqual(null);
      expect(
        resultState.alignments[0].links.find((link) => link._id === 'sbl-leb-1')
      ).toEqual(undefined);

      expect(resultState.alignments[0].links).toEqual([
        {
          _id: 'sbl-leb-2',
          sources: ['sbl_3'],
          targets: ['leb_1', 'leb_2'],
        },

        {
          _id: 'sbl-leb-8',
          sources: ['sbl_7'],
          targets: ['leb_3', 'leb_8'],
        },
      ]);

      expect(resultState.mode).toEqual(AlignmentMode.CleanSlate);
    });

    it('deletes the correct link out of several', () => {
      const previousState = {
        ...initialState,
        alignments: [
          {
            source: 'sbl',
            target: 'leb',
            links: [
              {
                _id: 'sbl-leb-1',
                sources: ['sbl_0'],
                targets: ['leb_1', 'leb_2'],
              },
            ],
            polarity: {
              type: 'primary',
              syntaxSide: 'sources',
              nonSyntaxSide: 'targets',
            } as PrimaryAlignmentPolarity,
          },
        ],
        inProgressLink: {
          _id: 'sbl-leb-1',
          source: 'sbl',
          target: 'leb',
          sources: ['sbl_30'],
          targets: ['leb_5'],
        },
      };

      const resultState = alignmentSliceReducer(previousState, deleteLink());

      expect(resultState.inProgressLink).toEqual(null);
      expect(resultState.alignments[0].links).toEqual([]);
      expect(resultState.mode).toEqual(AlignmentMode.CleanSlate);
    });
  });
});
