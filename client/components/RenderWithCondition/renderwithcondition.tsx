

import React, { ReactNode } from 'react';

interface RenderWithConditionProps {
    condition: boolean;
    children: ReactNode;
}

function RenderWithCondition({ condition, children }: RenderWithConditionProps) {
    return (
        <React.Fragment>
            {condition && children}
        </React.Fragment>
    );
}

export default RenderWithCondition;