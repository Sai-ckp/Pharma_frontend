import React from 'react';
import type {Meta, StoryObj} from '@storybook/react';

import {products} from './products';

const meta: Meta<typeof products> = {
  component: products,
};

export default meta;

type Story = StoryObj<typeof products>;

export const Basic: Story = {args: {}};
