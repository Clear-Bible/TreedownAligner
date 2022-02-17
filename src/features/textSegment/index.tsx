import React, { ReactElement } from 'react';

import useDebug from 'hooks/useDebug';

import { useAppDispatch, useAppSelector } from 'app/hooks';
import { toggleTextSegment } from 'state/textSegment.slice';
import { hover, relatedAlignments } from 'state/textSegmentHover.slice';
import { Alignment, Word, Text, Link } from 'structs';

interface TextSegmentProps {
  id: string;
  textId: string;
  segment: string;
}

const defaultStyle = { cursor: 'pointer' };
const focusedStyle = { textDecoration: 'underline' };
const selectedStyle = { backgroundColor: 'lightgrey' };
const linkedStyle = { border: '1px solid black' };

const findRelatedAlignments = (
  allAlignments: Alignment[],
  word: Word
): Alignment[] => {
  const filteredAlignments = allAlignments.map(
    (alignment: Alignment): Alignment | null => {
      const filteredLinks = alignment.links.filter((link: Link) => {
        return link.text1.includes(word.id) || link.text2.includes(word.id);
      });
      if (filteredLinks.length) {
        return { ...alignment, links: filteredLinks };
      }
      return null;
    }
  );

  return filteredAlignments.filter((x): x is Alignment => x !== null);
};

const computeStyle = (
  isHovered: boolean,
  isSelected: boolean,
  isLinked: boolean
): Record<string, string> => {
  let computedStyle = { ...defaultStyle };

  if (isHovered) {
    computedStyle = { ...computedStyle, ...focusedStyle };
  }

  if (isSelected) {
    computedStyle = { ...computedStyle, ...selectedStyle };
  }

  if (isLinked) {
    computedStyle = { ...computedStyle, ...linkedStyle };
  }

  return computedStyle;
};

export const TextSegment = (props: TextSegmentProps): ReactElement => {
  const { id } = props;

  useDebug('TextSegmentComponent');

  const dispatch = useAppDispatch();

  const word = useAppSelector((state) => {
    return state.polyglot.texts
      .find((text: Text) => {
        return text.id === props.textId;
      })
      ?.words.find((word: Word) => {
        return word.id === props.id;
      });
  });

  const alignments = useAppSelector((state) => {
    return state.polyglot.alignments;
  });

  const isHovered = useAppSelector(
    (state) => state.textSegmentHover.hovered?.id === id
  );

  const isSelected = Boolean(
    useAppSelector((state) => {
      console.log('isSelected');
      state.textSegment.present.selectedTextSegments.find((word: Word) => {
        return word.id === props.id;
      });
    })
  );

  //const selectedWord = useAppSelector((state) => {
    //return state.textSegmentHover.hovered;
  //});

  const isLinked = Boolean(
    useAppSelector((state) => {
      if (word) {
          console.log('TEST 1');
        const relatedAlignment = state.textSegmentHover.relatedAlignments.find(
          (alignment: Alignment) => {
            return (
              alignment.text1 === props.textId ||
              alignment.text2 === props.textId
            );
          }
        );

        console.log('TEST 2', relatedAlignment);
        const relatedLink = relatedAlignment?.links.filter((link: Link) => {
          return link.text1.includes(word.id) || link.text2.includes(word.id);
        });

        console.log('TEST 3', Boolean(relatedLink?.length), word.id);
        return Boolean(relatedLink?.length);
      }
    })
  );

  //const isLinked = Boolean(
  //useAppSelector((state) => {
  //console.log('isLinked');
  //if (!selectedWord) {
  //return false;
  //}

  //const relatedLinks = state.polyglot.alignments
  //.filter((alignment: Alignment) => {
  //return (
  //alignment.text1 === selectedWord.text ||
  //alignment.text2 === selectedWord.text
  //);
  //})
  //.map((alignment: Alignment) => {
  //const potentiallyRelatedLinks = alignment.links.filter(
  //(link: Link) => {
  //return (
  //link.text1.includes(selectedWord.id) ||
  //link.text2.includes(selectedWord.id)
  //);
  //}
  //);

  //if (word) {
  //return potentiallyRelatedLinks.filter((link: Link) => {
  //link.text1.includes(word.id) || link.text2.includes(word.id);
  //});
  //}
  //});

  //console.log('related links', relatedLinks);
  //const relatedAlignments = state.polyglot.alignments.filter(
  //(alignment: Alignment) => {
  //return (
  //alignment.text1 === props.textId || alignment.text2 === props.textId
  //);
  //}
  //);
  //const selectedWord = state.polyglot.texts
  //.find((text: Text) => {
  //return text.id === state.textSegmentHover.hovered?.text;
  //})
  //?.words.find((word: Word) => {
  //return word.id === state.textSegmentHover.hovered?.id;
  //});

  //const relatedText = state.polyglot.texts.filter((text: Text) => {
  //text.id === selectedWord.text;
  //});
  //})
  //);

  const computedStyle = computeStyle(isHovered, isSelected, isLinked);

  if (!word) {
    return <span>{'ERROR'}</span>;
  }
  return (
    <React.Fragment>
      <span> </span>
      <span
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
          if (word) {
            dispatch(toggleTextSegment(word));
          }
        }}
      >
        {props.segment}
      </span>
      <span> </span>
    </React.Fragment>
  );
};

export default TextSegment;
