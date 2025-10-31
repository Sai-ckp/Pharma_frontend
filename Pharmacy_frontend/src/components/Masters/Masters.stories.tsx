import React from 'react';
import type {Meta, StoryObj} from '@storybook/react';

import {Masters} from './Masters';

const meta: Meta<typeof Masters> = {
  component: Masters,
};

export default meta;

type Story = StoryObj<typeof Masters>;

export const Basic: Story = {args: {}};
