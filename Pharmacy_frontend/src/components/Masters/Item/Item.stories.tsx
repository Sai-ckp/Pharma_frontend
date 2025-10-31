import React from 'react';
import type {Meta, StoryObj} from '@storybook/react';

import {Item} from './Item';

const meta: Meta<typeof Item> = {
  component: Item,
};

export default meta;

type Story = StoryObj<typeof Item>;

export const Basic: Story = {args: {}};
