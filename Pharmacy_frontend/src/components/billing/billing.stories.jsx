import React from 'react';
import type {Meta, StoryObj} from '@storybook/react';

import {billing} from './billing';

const meta: Meta<typeof billing> = {
  component: billing,
};

export default meta;

type Story = StoryObj<typeof billing>;

export const Basic: Story = {args: {}};
