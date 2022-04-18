import { SyntaxRoot, SyntaxNode, Alignment, Link } from 'structs';

const mapAlignedWords = (
  sourceId: string,
  alignment: Alignment,
  secondaryAlignment: Alignment | null
): string[] => {
  //console.log(alignment.links);
  const matchedLinks = alignment.links.filter((link: Link) => {
    return link.targets.includes(sourceId);
  });

  let secondaryMatchedLinks: Link[] = [];

  if (secondaryAlignment) {
    //console.log('matched links?', matchedLinks);
    secondaryMatchedLinks = matchedLinks
      .map((matchedLink: Link) => {
        const secondaryLink = secondaryAlignment.links.find(
          (secondaryLink: Link) => {
            return secondaryLink.sources.find((secondaryLinkSource: string) => {
              //console.log(matchedLink.sources, secondaryLinkSource);
              return matchedLink.sources.includes(secondaryLinkSource);
            });
          }
        );

        return secondaryLink;
      })
      .filter((x): x is Link => Boolean(x));
  }

  if (secondaryMatchedLinks.length > 0) {
    console.log(secondaryMatchedLinks);
    return secondaryMatchedLinks.reduce((acc, curr) => {
      return acc.concat(curr.targets);
    }, [] as string[]);
}

  if (matchedLinks.length > 0) {
    return matchedLinks.reduce((acc, curr) => {
      return acc.concat(curr.sources);
    }, [] as string[]);
  }
  return [];
};

const _syntaxMapper = (
  syntaxNode: SyntaxNode,
  alignment: Alignment,
  secondaryAlignment: Alignment | null
): any => {
  if (syntaxNode.content?.elementType === 'w' && syntaxNode.content.n) {
    syntaxNode.content.alignedWordIds = mapAlignedWords(
      syntaxNode.content.n,
      alignment,
      secondaryAlignment
    );
  }

  if (syntaxNode.children.length > 0) {
    return syntaxNode.children.map((childSyntaxNode: SyntaxNode) => {
      return _syntaxMapper(childSyntaxNode, alignment, secondaryAlignment);
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
      if (link.targets.length > 1) {
        // MANY:1 || MANY
        // Split links to 1:MANY
        return link.targets.map((target: string, index: number) => {
          if (
            link.targets.length === index + 1 &&
            link.sources.length > link.targets.length
          ) {
            // For the last target, grab all remaining sources.
            return {
              sources: [...link.sources].splice(index),
              targets: [target],
            };
          }
          if (link.sources[index]) {
            return { sources: [link.sources[index]], targets: [target] };
          }
        });
      }
      return link;
    })
    .flat()
    .filter((x): x is Link => Boolean(x));
};

const syntaxMapper = (
  syntax: SyntaxRoot,
  alignment: Alignment,
  secondaryAlignment: Alignment | null = null
) => {
  const refactoredLinks = refactorLinks(alignment.links);
  console.log('refactor', refactoredLinks);
  _syntaxMapper(
    syntax,
    { ...alignment, links: refactoredLinks },
    secondaryAlignment
  );
  return syntax;
};

export default syntaxMapper;
