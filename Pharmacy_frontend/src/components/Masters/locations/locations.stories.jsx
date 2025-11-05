import React from 'react';
import type {Meta, StoryObj} from '@storybook/react';

import {locations} from './locations';

const meta: Meta<typeof locations> = {
  component: locations,
};

export default meta;

type Story = StoryObj<typeof locations>;

export const Basic: Story = {args: {}};
