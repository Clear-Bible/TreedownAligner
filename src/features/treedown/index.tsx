import { ReactElement } from 'react';

import useDebug from 'hooks/useDebug';
import { useAppSelector } from 'app/hooks';

import cssVar from 'styles/cssVar';

import { Corpus, CorpusRole } from 'structs';
import TextSegment from 'features/textSegment';

import 'features/treedown/styles.css';

interface TreedownProps {
  corpus: Corpus;
}

let theme: 'night' | 'day' = 'night';

const parsePosition = (osisId: string): number => {
  //Number(/^.*!(\w)/.exec(syntaxNode.content.osisId)[1]
  return 0;
};

const isClause = (syntaxNode: any) => {
  return syntaxNode.content.role === 'cl' || syntaxNode.content.class === 'cl';
};

const isPunctuation = (syntaxNode: any): boolean => {
  return Boolean(syntaxNode?.content.elementType === 'pc');
};

const isAdjunct = (syntaxNode: any): boolean => {
  return (
    syntaxNode.content.role === 'adv' ||
    syntaxNode.content.rule === 'sub-CL' ||
    syntaxNode.content.rule === 'that-VP'
  );
};

const recurseSyntax = (
  corpus: Corpus,
  syntax: any,
  depth: number,
  hasTrailingPunctuation: boolean = false
) => {
  return [syntax].map((syntaxNode) => {
    const graduatedDepth = depth * 0.5;

    if (syntaxNode.content.elementType === 'pc') {
      console.log('PC', syntaxNode);
      return <span className="pc">{syntaxNode.content.text}</span>;
    }

    if (syntaxNode.content && syntaxNode.content.elementType === 'sentence') {
      console.log('Sentence', syntaxNode);
      return syntaxNode.children.map((childSyntaxNode: any, index: number) => {
        return recurseSyntax(
          corpus,
          childSyntaxNode,
          0,
          isPunctuation(syntaxNode.children[index + 1])
        );
      });
    }

    if (isClause(syntaxNode)) {
      console.log('CL', syntaxNode);
      return (
        <div
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
                isPunctuation(syntaxNode.children[index + 1])
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
          <span
            style={{
              fontSize: '0.7rem',
              margin: '0.2rem',
              backgroundColor: cssVar('syntax-label-background', theme),
              borderRadius: '0.1rem',
              padding: '0.2rem',
              color: cssVar('font-color', theme),
            }}
          >
            {syntaxNode.content.role}
          </span>
          {syntaxNode.children &&
            syntaxNode.children.map((childSyntaxNode: any, index: number) => {
              return recurseSyntax(
                corpus,
                childSyntaxNode,
                graduatedDepth + 1,
                isPunctuation(syntaxNode.children[index + 1])
              );
            })}

          {syntaxNode.content.elementType === 'w' && (
            <span style={{ textIndent: `${graduatedDepth}rem` }}>
              <TextSegment
                word={{
                  id: syntaxNode.content.n,
                  corpusId: corpus.id,
                  role: CorpusRole.Source,
                  text: syntaxNode.content.text,
                  position: parsePosition(syntaxNode.content.osisId),
                }}
              />
            </span>
          )}
        </div>
      );
    }

    if (syntaxNode.children && syntaxNode.children.length) {
      return syntaxNode.children.map((childSyntaxNode: any, index: number) => {
        return recurseSyntax(
          corpus,
          childSyntaxNode,
          graduatedDepth + 1,
          isPunctuation(syntaxNode.children[index + 1])
        );
      });
    }

    if (syntaxNode.content && syntaxNode.content.elementType === 'w') {
      return (
        <TextSegment
          word={{
            id: syntaxNode.content.n,
            corpusId: corpus.id,
            role: CorpusRole.Source,
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
  const { corpus } = props;

  useDebug('TreedownComponent');

  console.log(JSON.parse(corpus.syntax));
  const reactTheme = useAppSelector((state) => {
    return state.app.theme;
  });

  theme = reactTheme as 'night' | 'day';

  let parsedSyntax = null;

  try {
    if (corpus.syntax) {
      parsedSyntax = JSON.parse(corpus.syntax);
    }
  } catch (error) {
    console.error('Could not parse syntax.');
    console.error(corpus.syntax);
    console.error(error);
  }
  if (parsedSyntax) {
    return (
      <div
        key={`corpus_${corpus.id}_treedown`}
        style={{
          paddingTop: '0.5rem',
          paddingBottom: '0.5rem',
          paddingLeft: '0.7rem',
          paddingRight: '0.7rem',
          color: cssVar('font-color', theme),
        }}
      >
        {recurseSyntax(corpus, parsedSyntax, 0)}
      </div>
    );
  }

  return <></>;
};

export default TreedownComponent;
