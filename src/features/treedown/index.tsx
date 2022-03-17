import { ReactElement, Fragment } from 'react';

import useDebug from 'hooks/useDebug';
import { useAppDispatch, useAppSelector } from 'app/hooks';

import cssVar from 'styles/cssVar';

import { Corpus, CorpusRole } from 'structs';
import TextSegment from 'features/textSegment';

import syntax from 'features/treedown/syntax.json';

import 'features/treedown/styles.css';

interface TreedownProps {
  corpus: Corpus;
}

const parsePosition = (osisId: string): number => {
  //Number(/^.*!(\w)/.exec(syntaxNode.content.osisId)[1]
  return 0;
};

const recurseSyntax = (corpus: Corpus, syntax: any, level: number) => {
  return [syntax].map((syntaxNode) => {
    if (syntaxNode.content && syntaxNode.content.elementType === 'wg') {
      //if (syntaxNode.content.class === 'cl') {
      //return syntaxNode.children.map((childSyntaxNode: any) => {
      //return recurseSyntax(corpus, childSyntaxNode, level + 1);
      //});
      //}

      const depth = level * 0.5;
      return (
        <div
          key={syntaxNode.content.n}
          className="wg"
          style={{ marginLeft: `${depth}rem`, marginTop: '0.1rem' }}
        >
          {syntaxNode.content.class && (
            <span
              style={{
                fontSize: '0.7rem',
                margin: '0.2rem',
                backgroundColor: 'lightgrey',
                borderRadius: '0.1rem',
                padding: '0.2rem',
                color: 'black',
              }}
            >
              {syntaxNode.content.class}
            </span>
          )}
          {syntaxNode.children.map((childSyntaxNode: any) => {
            return recurseSyntax(corpus, childSyntaxNode, level + 1);
          })}
        </div>
      );
    }

    if (syntaxNode.content && syntaxNode.content.elementType === 'w') {
      console.log(syntaxNode.content);
      return (
        <>
          <span
            style={{
              fontSize: '0.7rem',
              margin: '0.2rem',
              backgroundColor: 'lightgrey',
              borderRadius: '0.1rem',
              padding: '0.2rem',
              color: 'green',
            }}
          >
            {syntaxNode.content.class}
          </span>

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

    if (syntaxNode.content && syntaxNode.content.elementType === 'pc') {
      return <span>{syntaxNode.content.text}</span>;
    }
  });
};

export const TreedownComponent = (props: TreedownProps): ReactElement => {
  const { corpus } = props;

  useDebug('TreedownComponent');

  const theme = useAppSelector((state) => {
    return state.app.theme;
  });

  return (
    <div
      style={{
        paddingTop: '0.5rem',
        paddingBottom: '0.5rem',
        paddingLeft: '0.7rem',
        paddingRight: '0.7rem',
        color: cssVar('font-color', theme),
      }}
    >
      {recurseSyntax(corpus, syntax, 0)}
    </div>
  );
};

export default TreedownComponent;
