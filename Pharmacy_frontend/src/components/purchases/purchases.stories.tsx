import React from 'react';
import type {Meta, StoryObj} from '@storybook/react';

import {purchases} from './purchases';

const meta: Meta<typeof purchases> = {
  component: purchases,
};

export default meta;

type Story = StoryObj<typeof purchases>;

export const Basic: Story = {args: {}};
