import React from 'react';
import type {Meta, StoryObj} from '@storybook/react';

import {purchase_lines} from './purchase_lines';

const meta: Meta<typeof purchase_lines> = {
  component: purchase_lines,
};

export default meta;

type Story = StoryObj<typeof purchase_lines>;

export const Basic: Story = {args: {}};
