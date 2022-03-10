import React, { ReactElement } from 'react';

import useDebug from 'hooks/useDebug';
import { useAppDispatch, useAppSelector } from 'app/hooks';

import { toggleTextSegment, AlignmentMode } from 'state/alignment.slice';
import { hover, relatedAlignments } from 'state/textSegmentHover.slice';

import { Alignment, Word, CorpusRole, Link } from 'structs';
import findRelatedAlignments from 'helpers/findRelatedAlignments';

interface TextSegmentProps {
  word: Word;
}

const defaultStyle = { cursor: 'pointer', lineHeight: '1.4rem' };

const focusedStyle = { textDecoration: 'underline' };

const unlinkedStyle = { fontStyle: 'italic', color: 'dimgrey' };

const lockedStyle = { cursor: 'not-allowed' };

const selectedStyle = {
  backgroundColor: 'black',
  color: 'white',
  borderRadius: '0.25rem',
};
const relatedStyle = {
  WebkitTextStroke: '1px black',
  backgroundColor: 'yellow',
};

const computeStyle = (
  isHovered: boolean,
  isSelected: boolean,
  isRelated: boolean,
  isLinked: boolean,
  isCurrentLinkMember: boolean,
  mode: AlignmentMode
): Record<string, string> => {
  let computedStyle = { ...defaultStyle };

  if (isRelated && !isSelected && !(mode === AlignmentMode.Edit)) {
    computedStyle = { ...computedStyle, ...relatedStyle };
  }

  if (isHovered && !isSelected) {
    computedStyle = { ...computedStyle, ...focusedStyle };
  }

  if (isSelected) {
    computedStyle = { ...computedStyle, ...selectedStyle };
  }

  if (isLinked && mode === AlignmentMode.Edit && !isCurrentLinkMember) {
    computedStyle = { ...computedStyle, ...lockedStyle };
  }

  if (!isLinked && !isSelected) {
    computedStyle = { ...computedStyle, ...unlinkedStyle };
  }

  return computedStyle;
};

export const TextSegment = (props: TextSegmentProps): ReactElement => {
  const { word } = props;

  useDebug('TextSegmentComponent');

  const dispatch = useAppDispatch();

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
    // There is a BUG in here.
    // If this segment is involved in multiple links,
    // then we might grab the wrong one.
    let foundLink = null;

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

        if (word.id === 'sbl_13') {
          console.log('link', link);
          console.log('sourcesIntersection', sourcesIntersection);
          console.log('targetsIntersection', targetsIntersection);
        }

        return sourcesIntersection.length > 0 || targetsIntersection.length > 0;
      }
    })
  );

  const isCurrentLinkMember = mightBeWorkingOnLink || isInProgressLinkMember;

  const computedStyle = computeStyle(
    isHovered,
    isSelected,
    isRelated,
    isLinked,
    isCurrentLinkMember,
    mode
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
          console.log('click', mode);
          console.log('isLinked?', isLinked);
          console.log('isCurrentLinkMember?', isCurrentLinkMember);
          console.log('mightBeWorking?', mightBeWorkingOnLink);
          if (
            mode === AlignmentMode.Edit &&
            (!isLinked || isCurrentLinkMember)
          ) {
            console.log('toggle');
            dispatch(toggleTextSegment(word));
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
