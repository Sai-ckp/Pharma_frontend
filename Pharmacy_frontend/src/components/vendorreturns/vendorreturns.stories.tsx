import React from 'react';
import type {Meta, StoryObj} from '@storybook/react';

import {vendorreturns} from './vendorreturns';

const meta: Meta<typeof vendorreturns> = {
  component: vendorreturns,
};

export default meta;

type Story = StoryObj<typeof vendorreturns>;

export const Basic: Story = {args: {}};
