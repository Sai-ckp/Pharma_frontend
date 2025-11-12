import React from 'react';
import type {Meta, StoryObj} from '@storybook/react';

import {expiryalerts} from './expiryalerts';

const meta: Meta<typeof expiryalerts> = {
  component: expiryalerts,
};

export default meta;

type Story = StoryObj<typeof expiryalerts>;

export const Basic: Story = {args: {}};
