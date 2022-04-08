import React from 'react';
import { Text } from 'react-native';

export function Paragraph({
    paddingLeft,
    paddingRight,
    marginTop,
    marginBottom,
    textAlign,
    children
}) {
    let subtitle = [
        paddingLeft ? { paddingLeft } : '',
        paddingRight ? { paddingRight } : '',
        marginTop ? { marginTop } : '',
        marginBottom ? { marginBottom } : '',
        textAlign ? { textAlign } : ''
    ];

    return <Text style={[subtitle]}>{children}</Text>;
}
