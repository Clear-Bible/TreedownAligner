import { SyntaxNode, Alignment, Link } from 'structs';

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

const syntaxMapper = (syntax: SyntaxNode, alignment: Alignment) => {
  console.log('mapper alignment', alignment);
  const _syntax = Object.assign({ ...syntax }, {});

  _syntaxMapper(_syntax, alignment);

  return _syntax;
};

export default syntaxMapper;
