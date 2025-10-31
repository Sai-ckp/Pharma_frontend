import React from 'react';
import type {Meta, StoryObj} from '@storybook/react';

import {categories} from './categories';

const meta: Meta<typeof categories> = {
  component: categories,
};

export default meta;

type Story = StoryObj<typeof categories>;

export const Basic: Story = {args: {}};
