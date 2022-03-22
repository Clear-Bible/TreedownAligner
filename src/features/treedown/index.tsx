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

const recurseSyntax = (corpus: Corpus, syntax: any, level: number) => {
  return [syntax].map((syntaxNode) => {
    const depth = level * 0.5;

    if (syntaxNode.content.elementType === 'pc') {
      console.log('PC', syntaxNode);
      return <span className="pc">{syntaxNode.content.text}</span>;
    }

    if (syntaxNode.content && syntaxNode.content.elementType === 'sentence') {
      console.log('Sentence', syntaxNode);
      return syntaxNode.children.map((childSyntaxNode: any) => {
        return recurseSyntax(corpus, childSyntaxNode, 0);
      });
    }

    if (syntaxNode.content.class === 'cl' || syntaxNode.content.role === 'cl') {
      console.log('CL', syntaxNode);
      return (
        <div className="cl" style={{ marginLeft: `${depth}rem` }}>
          {syntaxNode.children &&
            syntaxNode.children.map((childSyntaxNode: any) => {
              return recurseSyntax(corpus, childSyntaxNode, level + 1);
            })}
        </div>
      );
    }

    if (syntaxNode.content.role) {
      return (
        <div
          className="constituent"
          style={{ marginTop: '5px', marginBottom: '5px' }}
        >
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
            syntaxNode.children.map((childSyntaxNode: any) => {
              return recurseSyntax(corpus, childSyntaxNode, level);
            })}

          {syntaxNode.content.elementType === 'w' && (
            <TextSegment
              word={{
                id: syntaxNode.content.n,
                corpusId: corpus.id,
                role: CorpusRole.Source,
                text: syntaxNode.content.text,
                position: parsePosition(syntaxNode.content.osisId),
              }}
            />
          )}
        </div>
      );
    }

    //return (
    //<div
    //key={syntaxNode.content.n}
    //className="wg"
    //style={{ marginLeft: `${depth}rem`, marginTop: '0.1rem' }}
    //>
    //{syntaxNode.content.class && (
    //<span
    //style={{
    //fontSize: '0.7rem',
    //margin: '0.2rem',
    //backgroundColor: cssVar('syntax-label-background', theme),
    //borderRadius: '0.1rem',
    //padding: '0.2rem',
    //color: cssVar('font-color', theme),
    //}}
    //>
    //{syntaxNode.content.class}
    //</span>
    //)}
    //{syntax.children.map((childSyntaxNode: any) => {
    //return recurseSyntax(corpus, childSyntaxNode, level + 1);
    //})}
    //</div>
    //);

    if (syntaxNode.children && syntaxNode.children.length) {
      return syntaxNode.children.map((childSyntaxNode: any) => {
        return recurseSyntax(corpus, childSyntaxNode, level);
      });
    }

    if (syntaxNode.content && syntaxNode.content.elementType === 'w') {
      return (
        <>
          <TextSegment
            word={{
              id: syntaxNode.content.n,
              corpusId: corpus.id,
              role: CorpusRole.Source,
              text: syntaxNode.content.text,
              position: parsePosition(syntaxNode.content.osisId),
            }}
          />
        </>
      );
    }

    return null;
  });
};

export const TreedownComponent = (props: TreedownProps): ReactElement => {
  const { corpus } = props;

  useDebug('TreedownComponent');

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
