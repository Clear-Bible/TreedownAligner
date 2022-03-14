import React, { ReactElement } from 'react';

import useDebug from 'hooks/useDebug';
import { useAppDispatch, useAppSelector } from 'app/hooks';

import { toggleTextSegment, AlignmentMode } from 'state/alignment.slice';
import { hover, relatedAlignments } from 'state/textSegmentHover.slice';

import { Alignment, Word, CorpusRole, Link } from 'structs';
import findRelatedAlignments from 'helpers/findRelatedAlignments';

import 'styles/theme.css';
import cssVar from 'styles/cssVar';

interface TextSegmentProps {
  word: Word;
}

const defaultStyle = (theme: 'night' | 'day') => {
  return {
    cursor: 'pointer',
    lineHeight: '1.4rem',
    color: cssVar('font-color', theme),
  };
};

const focusedStyle = () => {
  return { textDecoration: 'underline' };
};

const unlinkedStyle = (theme: 'night' | 'day') => {
  return { fontStyle: 'italic', color: cssVar('unlinked-font-color', theme) };
};

const lockedStyle = () => {
  return { cursor: 'not-allowed' };
};

const selectedStyle = (theme: 'night' | 'day') => {
  return {
    backgroundColor: cssVar('selected-segment-background-color', theme),
    color: cssVar('selected-segment-font-color', theme),
    borderRadius: '0.25rem',
  };
};

const relatedStyle = () => {
  return {
    WebkitTextStroke: `1px black`,
    backgroundColor: 'yellow',
  };
};

const computeStyle = (
  isHovered: boolean,
  isSelected: boolean,
  isRelated: boolean,
  isLinked: boolean,
  isCurrentLinkMember: boolean,
  isInvolved: boolean,
  role: CorpusRole,
  mode: AlignmentMode,
  theme: 'night' | 'day'
): Record<string, string> => {
  let computedStyle = { ...defaultStyle(theme) };

  if (isRelated && !isSelected && !(mode === AlignmentMode.Edit)) {
    computedStyle = { ...computedStyle, ...relatedStyle() };
  }

  if (isHovered && !isSelected) {
    computedStyle = { ...computedStyle, ...focusedStyle() };
  }

  if (isSelected) {
    computedStyle = { ...computedStyle, ...selectedStyle(theme) };
  }

  if (isLinked && mode === AlignmentMode.Edit && !isCurrentLinkMember) {
    computedStyle = { ...computedStyle, ...lockedStyle() };
  }

  if (mode === AlignmentMode.Edit && isCurrentLinkMember && !isSelected) {
    computedStyle = { ...computedStyle, ...unlinkedStyle(theme) };
  }

  if (!isLinked && !isSelected) {
    computedStyle = { ...computedStyle, ...unlinkedStyle(theme) };
  }

  if (isLinked && role === 'source' && !isCurrentLinkMember) {
    computedStyle = { ...computedStyle, ...lockedStyle() };
  }

  if (!isInvolved && mode === AlignmentMode.Edit) {
    computedStyle = { ...computedStyle, ...lockedStyle() };
  }

  return computedStyle;
};

export const TextSegment = (props: TextSegmentProps): ReactElement => {
  const { word } = props;

  useDebug('TextSegmentComponent');

  const dispatch = useAppDispatch();

  const theme = useAppSelector((state) => {
    return state.app.theme;
  });

  const alignments = useAppSelector((state) => {
    return state.alignment.present.alignments;
  });

  const mode = useAppSelector((state) => {
    return state.alignment.present.mode;
  });

  const isHovered = useAppSelector(
    (state) => state.textSegmentHover.hovered?.id === word.id
  );

  const isSelected = Boolean(
    useAppSelector((state) => {
      if (word.role === CorpusRole.Source) {
        return state.alignment.present.inProgressLink?.sources.includes(
          word.id
        );
      }
      if (word.role === CorpusRole.Target) {
        return state.alignment.present.inProgressLink?.targets.includes(
          word.id
        );
      }
    })
  );

  const isInProgressLinkMember = Boolean(
    useAppSelector((state) => {
      return (
        state.alignment.present.inProgressLink?.sources.includes(word.id) ||
        state.alignment.present.inProgressLink?.targets.includes(word.id)
      );
    })
  );

  const isRelated = Boolean(
    useAppSelector((state) => {
      if (word) {
        const relatedAlignment = state.textSegmentHover.relatedAlignments.find(
          (alignment: Alignment) => {
            return (
              alignment.source === word.corpusId ||
              alignment.target === word.corpusId
            );
          }
        );

        const relatedLink = relatedAlignment?.links.filter((link: Link) => {
          return (
            link.sources.includes(word.id) || link.targets.includes(word.id)
          );
        });

        return Boolean(relatedLink?.length);
      }
    })
  );

  const link = useAppSelector((state) => {
    const inProgressLink = state.alignment.present.inProgressLink;

    const contextualAlignment = state.alignment.present.alignments.find(
      (alignment: Alignment) => {
        if (inProgressLink) {
          return (
            inProgressLink.source === alignment.source &&
            inProgressLink.target === alignment.target
          );
        }
        return false;
      }
    );

    let foundLink = null;

    if (contextualAlignment) {
      if (word) {
        for (const link of contextualAlignment.links) {
          if (
            link.sources.includes(word.id) ||
            link.targets.includes(word.id)
          ) {
            foundLink = link;
          }
        }
      }
    } else {
      if (word) {
        const possibleAlignments = state.alignment.present.alignments.filter(
          (alignment: Alignment) => {
            return (
              alignment.source === word.corpusId ||
              alignment.target === word.corpusId
            );
          }
        );
        for (const alignment of possibleAlignments) {
          for (const link of alignment.links) {
            if (
              link.sources.includes(word.id) ||
              link.targets.includes(word.id)
            ) {
              foundLink = link;
            }
          }
        }
      }
    }
    return foundLink;
  });

  const isLinked = Boolean(link);

  const mightBeWorkingOnLink = Boolean(
    useAppSelector((state) => {
      const inProgressLink = state.alignment.present.inProgressLink;

      if (inProgressLink && link) {
        const sourcesIntersection = link.sources.filter((sourceId) => {
          return inProgressLink.sources.includes(sourceId);
        });
        const targetsIntersection = link.targets.filter((targetId) => {
          return inProgressLink.targets.includes(targetId);
        });

        return sourcesIntersection.length > 0 || targetsIntersection.length > 0;
      }
    })
  );

  const isCurrentLinkMember = mightBeWorkingOnLink || isInProgressLinkMember;

  const isInvolved = Boolean(
    useAppSelector((state) => {
      const inProgressLink = state.alignment.present.inProgressLink;
      if (inProgressLink) {
        return (
          inProgressLink.source === word.corpusId ||
          inProgressLink.target === word.corpusId
        );
      }
    })
  );

  const computedStyle = computeStyle(
    isHovered,
    isSelected,
    isRelated,
    isLinked,
    isCurrentLinkMember,
    isInvolved,
    word.role,
    mode,
    theme
  );

  if (!word) {
    return <span>{'ERROR'}</span>;
  }
  return (
    <React.Fragment>
      <span> </span>
      <span
        className="text-segment"
        style={computedStyle}
        onMouseEnter={() => {
          dispatch(hover(word));
          dispatch(relatedAlignments(findRelatedAlignments(alignments, word)));
        }}
        onMouseLeave={() => {
          dispatch(hover(null));
          dispatch(relatedAlignments([]));
        }}
        onClick={() => {
          if (
            mode === AlignmentMode.Edit &&
            (!isLinked || isCurrentLinkMember) &&
            isInvolved
          ) {
            dispatch(toggleTextSegment(word));
          } else if (word.role === 'source') {
            // ...do nothing...
            // for now users have to create / edit
            // by going to a target first.
          } else if (mode === AlignmentMode.CleanSlate) {
            dispatch(toggleTextSegment(word));
          }
        }}
      >
        {props.word.text}
      </span>
      <span> </span>
    </React.Fragment>
  );
};

export default TextSegment;
