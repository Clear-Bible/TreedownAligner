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

// Search for many:many links and refactor them.
// That is, split them so that they are 1:1 or 1:many.
// Group by array order.
const refactorLinks = (links: Link[]) => {
  return links
    .map((link) => {
      if (link.sources.length > 1 && link.targets.length > 1) {
        return link.sources.map((source: string, index: number) => {
          // Bug: the last source needs to grab all remaining targets.
          // Or something better than this ^.
          return { sources: [source], targets: [link.targets[index]] };
        });
      }
      return link;
    })
    .flat();
};

const syntaxMapper = (syntax: SyntaxRoot, alignment: Alignment) => {
  const refactoredLinks = refactorLinks(alignment.links);
  _syntaxMapper(syntax, { ...alignment, links: refactoredLinks });
  return syntax;
};

export default syntaxMapper;
