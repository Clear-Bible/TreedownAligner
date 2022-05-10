import { SyntaxRoot, SyntaxNode, Alignment, Link } from 'structs';

const mapAlignedWords = (
  sourceId: string,
  alignment: Alignment,
  secondaryAlignment: Alignment | null
): string[] => {
  const matchedLinks = alignment.links.filter((link: Link) => {
    if (alignment.polarity.type === 'primary') {
      return link[alignment.polarity.syntaxSide].includes(sourceId);
    } else {
      console.error('AlignmentPolarity', alignment, sourceId);
      throw new Error(`Unexpected AlignmentPolarity`);
    }
  });

  let secondaryMatchedLinks: Link[] = [];
  if (alignment.polarity.type === 'primary') {
    const nonSyntaxSideName = alignment.polarity.nonSyntaxSide;
    if (
      secondaryAlignment &&
      secondaryAlignment.polarity.type === 'secondary'
    ) {
      const mappedSideName = secondaryAlignment.polarity.mappedSide;
      const nonMappedSideName = secondaryAlignment.polarity.nonMappedSide;

      secondaryMatchedLinks = matchedLinks
        .map((matchedLink: Link) => {
          const secondaryLink = secondaryAlignment.links.find(
            (secondaryLink: Link) => {
              return secondaryLink[mappedSideName].find(
                (secondaryLinkMappedId: string) => {
                  return matchedLink[nonSyntaxSideName].includes(
                    secondaryLinkMappedId
                  );
                }
              );
            }
          );

          return secondaryLink;
        })
        .filter((x): x is Link => Boolean(x));

      if (secondaryMatchedLinks.length > 0) {
        return secondaryMatchedLinks.reduce((acc, curr) => {
          return acc.concat(curr[nonMappedSideName]);
        }, [] as string[]);
      }
    }

    if (matchedLinks.length > 0) {
      return matchedLinks.reduce((acc, curr) => {
        return acc.concat(curr[nonSyntaxSideName]);
      }, [] as string[]);
    }
    return [];
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
const refactorLinks = (alignment: Alignment | null): Alignment | null => {
  if (alignment === null) {
    return null;
  }

  const clean = (links: any[]): Link[] => {
    return links.flat().filter((x): x is Link => Boolean(x) && x !== null);
  };

  return {
    ...alignment,
    links: clean(
      alignment.links.map((link: Link) => {
        // Handle Primary Polarity
        if (alignment.polarity.type === 'primary') {
          const syntaxSide = alignment.polarity.syntaxSide;
          const nonSyntaxSide = alignment.polarity.nonSyntaxSide;

          if (link[syntaxSide].length > 1) {
            // MANY:1 || MANY
            // Split links to 1:MANY
            return link[syntaxSide].map(
              (syntaxSideId: string, index: number) => {
                if (
                  link[syntaxSide].length === index + 1 &&
                  link[nonSyntaxSide].length > link[syntaxSide].length
                ) {
                  // For the last target, grab all remaining sources.
                  return {
                    [syntaxSide]: [syntaxSideId],
                    [nonSyntaxSide]: [...link[nonSyntaxSide]].splice(index),
                  };
                }
                if (link[nonSyntaxSide][index]) {
                  return {
                    [nonSyntaxSide]: [link[nonSyntaxSide][index]],
                    [syntaxSide]: [syntaxSideId],
                  };
                }
                return null;
              }
            );
          }
          return link;
        } else if (alignment.polarity.type === 'secondary') {
          // Handle Secondary Polarity
          const mappedSide = link[alignment.polarity.mappedSide];
          const nonMappedSide = link[alignment.polarity.nonMappedSide];

          const mappedSideName = alignment.polarity.mappedSide;
          const nonMappedSideName = alignment.polarity.nonMappedSide;

          if (mappedSide.length > 1) {
            // MANY:1 || MANY
            // Split links to 1:MANY
            return mappedSide.map((mappedId: string, index: number) => {
              if (
                mappedSide.length === index + 1 &&
                nonMappedSide.length > mappedSide.length
              ) {
                // For the last target, grab all remaining sources.
                return {
                  [nonMappedSideName]: [...nonMappedSide.splice(index)],
                  [mappedSideName]: [mappedId],
                };
              }
              if (nonMappedSide[index]) {
                return {
                  [nonMappedSideName]: [nonMappedSide[index]],
                  [mappedSideName]: [mappedId],
                };
              }
              return null;
            });
          }
          return link;
        }
        return null;
      })
    ),
  };
};

const syntaxMapper = (
  syntax: SyntaxRoot,
  alignment: Alignment,
  secondaryAlignment: Alignment | null = null
) => {
  const refactoredPrimaryAlignment = refactorLinks(alignment);
  const refactoredSecondaryAlignment = refactorLinks(secondaryAlignment);

  if (refactoredPrimaryAlignment) {
    _syntaxMapper(
      syntax,
      refactoredPrimaryAlignment,
      refactoredSecondaryAlignment
    );
  }
  return syntax;
};

export default syntaxMapper;
