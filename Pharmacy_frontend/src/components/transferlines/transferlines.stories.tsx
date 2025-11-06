import React from 'react';
import type {Meta, StoryObj} from '@storybook/react';

import {transferlines} from './transferlines';

const meta: Meta<typeof transferlines> = {
  component: transferlines,
};

export default meta;

type Story = StoryObj<typeof transferlines>;

export const Basic: Story = {args: {}};
