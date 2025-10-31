import React from 'react';
import type {Meta, StoryObj} from '@storybook/react';

import {item} from './item';

const meta: Meta<typeof item> = {
  component: item,
};

export default meta;

type Story = StoryObj<typeof item>;

export const Basic: Story = {args: {}};
