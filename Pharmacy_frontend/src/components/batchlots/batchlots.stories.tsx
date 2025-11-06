import React from 'react';
import type {Meta, StoryObj} from '@storybook/react';

import {batchlots} from './batchlots';

const meta: Meta<typeof batchlots> = {
  component: batchlots,
};

export default meta;

type Story = StoryObj<typeof batchlots>;

export const Basic: Story = {args: {}};
