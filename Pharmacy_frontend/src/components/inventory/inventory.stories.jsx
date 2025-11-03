import React from 'react';
import type {Meta, StoryObj} from '@storybook/react';

import {inventory} from './inventory';

const meta: Meta<typeof inventory> = {
  component: inventory,
};

export default meta;

type Story = StoryObj<typeof inventory>;

export const Basic: Story = {args: {}};
