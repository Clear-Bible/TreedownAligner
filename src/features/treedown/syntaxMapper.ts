import { SyntaxRoot, SyntaxNode, Alignment, Link } from 'structs';

type AlignmentSide = 'sources' | 'targets';

interface AlignmentPolarity {
  primary: {
    syntaxSide: AlignmentSide;
    nonSyntaxSide: AlignmentSide;
  };

  secondary: {
    mappedSide?: AlignmentSide;
    nonMappedSide?: AlignmentSide;
  };
}

const mapAlignedWords = (
  sourceId: string,
  alignment: Alignment,
  secondaryAlignment: Alignment | null,
  ap: AlignmentPolarity
): string[] => {
  const matchedLinks = alignment.links.filter((link: Link) => {
    return link[ap.primary.syntaxSide].includes(sourceId);
  });

  let secondaryMatchedLinks: Link[] = [];

  if (
    secondaryAlignment &&
    ap.secondary !== undefined &&
    ap.secondary.mappedSide !== undefined &&
    ap.secondary.nonMappedSide !== undefined
  ) {
    secondaryMatchedLinks = matchedLinks
      .map((matchedLink: Link) => {
        const secondaryLink = secondaryAlignment.links.find(
          (secondaryLink: Link) => {
            if (
              ap.secondary !== undefined &&
              ap.secondary.mappedSide !== undefined &&
              ap.secondary.nonMappedSide !== undefined
            ) {
              return secondaryLink[ap.secondary.mappedSide].find(
                (secondaryLinkMappedId: string) => {
                  return matchedLink[ap.primary.nonSyntaxSide].includes(
                    secondaryLinkMappedId
                  );
                }
              );
            }
          }
        );

        return secondaryLink;
      })
      .filter((x): x is Link => Boolean(x));
  }

  if (secondaryMatchedLinks.length > 0) {
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
  secondaryAlignment: Alignment | null,
  alignmentPolarity: AlignmentPolarity
): any => {
  if (syntaxNode.content?.elementType === 'w' && syntaxNode.content.n) {
    syntaxNode.content.alignedWordIds = mapAlignedWords(
      syntaxNode.content.n,
      alignment,
      secondaryAlignment,
      alignmentPolarity
    );
  }

  if (syntaxNode.children.length > 0) {
    return syntaxNode.children.map((childSyntaxNode: SyntaxNode) => {
      return _syntaxMapper(
        childSyntaxNode,
        alignment,
        secondaryAlignment,
        alignmentPolarity
      );
    });
  }
  return syntaxNode;
};

// Search for many:many links and refactor them.
// That is, split them so that they are 1:1 or 1:many.
// Group by array order.
const refactorLinks = (
  primaryLinks: Link[],
  secondaryLinks: Link[] | undefined,
  alignmentPolarity: AlignmentPolarity
): [Link[], Link[] | null] => {
  const refactoredPrimaryLinks = primaryLinks.map((link) => {
    if (link[alignmentPolarity.primary.syntaxSide].length > 1) {
      // MANY:1 || MANY
      // Split links to 1:MANY
      return link[alignmentPolarity.primary.syntaxSide].map(
        (syntaxSideId: string, index: number) => {
          if (
            link[alignmentPolarity.primary.syntaxSide].length === index + 1 &&
            link[alignmentPolarity.primary.nonSyntaxSide].length >
              link[alignmentPolarity.primary.syntaxSide].length
          ) {
            // For the last target, grab all remaining sources.
            return {
              [alignmentPolarity.primary.syntaxSide]: [syntaxSideId],
              [alignmentPolarity.primary.nonSyntaxSide]: [
                ...link[alignmentPolarity.primary.nonSyntaxSide],
              ].splice(index),
            };
          }
          if (link[alignmentPolarity.primary.nonSyntaxSide][index]) {
            return {
              [alignmentPolarity.primary.nonSyntaxSide]: [
                link[alignmentPolarity.primary.nonSyntaxSide][index],
              ],
              [alignmentPolarity.primary.syntaxSide]: [syntaxSideId],
            };
          }
        }
      );
    }
    return link;
  });

  const refactoredSecondaryLinks = secondaryLinks?.map((link) => {
    if (
      alignmentPolarity.secondary !== undefined &&
      alignmentPolarity.secondary.mappedSide !== undefined &&
      alignmentPolarity.secondary.nonMappedSide !== undefined
    ) {
      const mappedSide = link[alignmentPolarity.secondary.mappedSide];
      const nonMappedSide = link[alignmentPolarity.secondary.nonMappedSide];

      if (mappedSide && nonMappedSide) {
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
                [String(alignmentPolarity.secondary.nonMappedSide)]: [
                  ...nonMappedSide.splice(index),
                ],
                [String(alignmentPolarity.secondary.mappedSide)]: [mappedId],
              };
            }
            if (nonMappedSide[index]) {
              return {
                [String(alignmentPolarity.secondary.nonMappedSide)]: [
                  nonMappedSide[index],
                ],
                [String(alignmentPolarity.secondary.mappedSide)]: [mappedId],
              };
            }
          });
        }
        return link;
      }
    }
  });

  const clean = (links: any[]): Link[] => {
    return links.flat().filter((x): x is Link => Boolean(x) && x !== null);
  };

  return [
    clean(refactoredPrimaryLinks),
    secondaryLinks && refactoredSecondaryLinks
      ? clean(refactoredSecondaryLinks)
      : null,
  ];
};

const syntaxMapper = (
  syntax: SyntaxRoot,
  alignment: Alignment,
  secondaryAlignment: Alignment | null = null,
  alignmentPolarity: AlignmentPolarity
) => {
  const [refactoredPrimaryLinks, refactoredSecondaryLinks] = refactorLinks(
    alignment.links,
    secondaryAlignment?.links,
    alignmentPolarity
  );

  const processedSecondaryAlignment = secondaryAlignment
    ? { ...secondaryAlignment, links: refactoredSecondaryLinks ?? [] }
    : null;

  _syntaxMapper(
    syntax,
    { ...alignment, links: refactoredPrimaryLinks },
    processedSecondaryAlignment,
    alignmentPolarity
  );
  return syntax;
};

export default syntaxMapper;
