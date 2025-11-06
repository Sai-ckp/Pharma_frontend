import React from 'react';
import type {Meta, StoryObj} from '@storybook/react';

import {saleslines} from './saleslines';

const meta: Meta<typeof saleslines> = {
  component: saleslines,
};

export default meta;

type Story = StoryObj<typeof saleslines>;

export const Basic: Story = {args: {}};
