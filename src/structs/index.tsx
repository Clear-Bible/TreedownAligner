export interface TextSegment {
    id: string,
    text: string,
}

export interface Text {
    id: string,
    segments: TextSegment[]
}
