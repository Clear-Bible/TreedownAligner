import { ReactElement } from 'react';
import { Typography, Chip, Tooltip } from '@mui/material';

import useDebug from 'hooks/useDebug';
import { useAppSelector } from 'app/hooks';

import cssVar from 'styles/cssVar';

import { Corpus, SyntaxNode, TreedownType, Word } from 'structs';
import TextSegment from 'features/textSegment';

import { findWordById } from 'helpers/findWord';

import './styles.css';

interface TreedownProps {
  corpus: Corpus;
  treedownType: TreedownType;
}

let theme: 'night' | 'day' = 'night';

const parsePosition = (osisId: string): number => {
  //Number(/^.*!(\w)/.exec(syntaxNode.content.osisId)[1]
  return 0;
};

const isClause = (syntaxNode: SyntaxNode) => {
  return syntaxNode.content.role === 'cl' || syntaxNode.content.class === 'cl';
};

const isPunctuation = (syntaxNode: SyntaxNode): boolean => {
  return Boolean(syntaxNode?.content.elementType === 'pc');
};

const isAdjunct = (syntaxNode: SyntaxNode): boolean => {
  return syntaxNode.content.role === 'adv';
};

const renderMappedTextSegment = (syntaxNode: SyntaxNode, corpus: Corpus) => {
  if (
    syntaxNode.content.alignedWordIds &&
    syntaxNode.content.alignedWordIds.length > 0
  ) {
    return syntaxNode.content.alignedWordIds.map((alignedWordId) => {
      return (
        <TextSegment
          key={alignedWordId}
          word={findWordById([corpus], alignedWordId) ?? ({} as Word)}
        />
      );
    });
  }
};

const recurseSyntax = (
  corpus: Corpus,
  syntax: SyntaxNode,
  depth: number,
  hasTrailingPunctuation: boolean = false,
  treedownType: TreedownType
): any => {
  return [syntax].map((syntaxNode, index) => {
    const graduatedDepth = depth * 0.5;

    if (syntaxNode.content.elementType === 'pc') {
      return (
        treedownType === TreedownType.Source && (
          <span className="pc">{syntaxNode.content.text}</span>
        )
      );
    }

    if (syntaxNode.content && syntaxNode.content.elementType === 'sentence') {
      return syntaxNode.children.map(
        (childSyntaxNode: SyntaxNode, index: number) => {
          return recurseSyntax(
            corpus,
            childSyntaxNode,
            0,
            isPunctuation(syntaxNode.children[index + 1]),
            treedownType
          );
        }
      );
    }

    if (isClause(syntaxNode)) {
      return (
        <div
          key={`cl-${syntaxNode.content.n}-${index}-${graduatedDepth}`}
          className="cl"
          style={{
            marginLeft: `${graduatedDepth}rem`,
            marginTop: '5px',
            marginBottom: '5px',
          }}
        >
          {isAdjunct(syntaxNode) && (
            <span
              style={{
                fontSize: '0.7rem',
                margin: '0.2rem',
                borderRadius: '0.1rem',
                padding: '0.2rem',
                color: cssVar('font-color', theme),
              }}
            >
              +
            </span>
          )}
          {syntaxNode.children &&
            syntaxNode.children.map((childSyntaxNode: any, index: number) => {
              return recurseSyntax(
                corpus,
                childSyntaxNode,
                graduatedDepth + 1,
                isPunctuation(syntaxNode.children[index + 1]),
                treedownType
              );
            })}
        </div>
      );
    }

    if (syntaxNode.content.role) {
      let calculatedWidth = '100%';

      if (hasTrailingPunctuation) {
        calculatedWidth = 'fit-content';
      }

      return (
        <div
          key={`consituent-${syntaxNode.content.n}-${index}-${graduatedDepth}`}
          className="constituent"
          style={{
            marginTop: '5px',
            marginBottom: '5px',
            width: calculatedWidth,
            display: 'inline-block',
          }}
        >
          {isAdjunct(syntaxNode) && (
            <span
              style={{
                fontSize: '0.7rem',
                margin: '0.2rem',
                borderRadius: '0.1rem',
                padding: '0.2rem',
                color: cssVar('font-color', theme),
              }}
            >
              +
            </span>
          )}

          {syntaxNode.content.role !== 'adv' && (
            <Tooltip
              title="An explanatory comment of this constituent."
              arrow
              describeChild
            >
              <Chip
                className="constituent-role"
                size="small"
                label={syntaxNode.content.role}
                style={{ fontSize: '0.7rem' }}
              />
            </Tooltip>
          )}

          {syntaxNode.children &&
            syntaxNode.children.map(
              (childSyntaxNode: SyntaxNode, index: number) => {
                return recurseSyntax(
                  corpus,
                  childSyntaxNode,
                  graduatedDepth + 1,
                  isPunctuation(syntaxNode.children[index + 1]),
                  treedownType
                );
              }
            )}

          {syntaxNode.content.elementType === 'w' &&
            syntaxNode.content.n &&
            syntaxNode.content.osisId &&
            syntaxNode.content.text && (
              <Typography
                paragraph={false}
                display="inline"
                style={{ textIndent: `${graduatedDepth}rem` }}
              >
                {treedownType === TreedownType.Mapped &&
                  renderMappedTextSegment(syntaxNode, corpus)}

                {treedownType === TreedownType.Source && (
                  <TextSegment
                    word={{
                      id: syntaxNode.content.n,
                      corpusId: corpus.id,
                      text: syntaxNode.content.text,
                      position: parsePosition(syntaxNode.content.osisId),
                    }}
                  />
                )}
              </Typography>
            )}
        </div>
      );
    }

    if (syntaxNode.children && syntaxNode.children.length) {
      return syntaxNode.children.map(
        (childSyntaxNode: SyntaxNode, index: number) => {
          return recurseSyntax(
            corpus,
            childSyntaxNode,
            graduatedDepth + 1,
            isPunctuation(syntaxNode.children[index + 1]),
            treedownType
          );
        }
      );
    }

    if (
      syntaxNode.content.elementType === 'w' &&
      syntaxNode.content.n &&
      syntaxNode.content.osisId &&
      syntaxNode.content.text
    ) {
      if (treedownType === TreedownType.Mapped) {
        return renderMappedTextSegment(syntaxNode, corpus);
      }
      return (
        <TextSegment
          word={{
            id: syntaxNode.content.n,
            corpusId: corpus.id,
            text: syntaxNode.content.text,
            position: parsePosition(syntaxNode.content.osisId),
          }}
        />
      );
    }

    return null;
  });
};

export const TreedownComponent = (props: TreedownProps): ReactElement => {
  const { corpus, treedownType } = props;

  useDebug('TreedownComponent');

  const reactTheme = useAppSelector((state) => {
    return state.app.theme;
  });

  theme = reactTheme as 'night' | 'day';

  if (corpus.syntax && Object.keys(corpus.syntax).length > 0) {
    return (
      <div
        key={`corpus_wrapper_${corpus.id}_treedown`}
        style={{
          paddingTop: '0.5rem',
          paddingBottom: '0.5rem',
          paddingLeft: '0.7rem',
          paddingRight: '0.7rem',
        }}
      >
        {recurseSyntax(corpus, corpus.syntax, 0, false, treedownType)}
      </div>
    );
  }

  return <></>;
};

export default TreedownComponent;
