import { SyntaxRoot, SyntaxNode, Alignment, Link } from 'structs';

const mapAlignedWords = (sourceId: string, alignment: Alignment): string[] => {
  const matchedLinks = alignment.links.filter((link: Link) => {
    return link.targets.includes(sourceId);
  });

  if (matchedLinks.length > 0) {
    return matchedLinks.reduce((acc, curr) => {
      return acc.concat(curr.sources);
    }, [] as string[]);
  }
  return [];
};

const _syntaxMapper = (syntaxNode: SyntaxNode, alignment: Alignment): any => {
  if (syntaxNode.content?.elementType === 'w' && syntaxNode.content.n) {
    syntaxNode.content.alignedWordIds = mapAlignedWords(
      syntaxNode.content.n,
      alignment
    );
  }

  if (syntaxNode.children.length > 0) {
    return syntaxNode.children.map((childSyntaxNode: SyntaxNode) => {
      return _syntaxMapper(childSyntaxNode, alignment);
    });
  }
  return syntaxNode;
};

const syntaxMapper = (syntax: SyntaxRoot, alignment: Alignment) => {
  const _syntax = JSON.parse(JSON.stringify(syntax));

  _syntaxMapper(_syntax, alignment);

  return _syntax;
};

export default syntaxMapper;
