import React from 'react';
import type {Meta, StoryObj} from '@storybook/react';

import {prescriptions} from './prescriptions';

const meta: Meta<typeof prescriptions> = {
  component: prescriptions,
};

export default meta;

type Story = StoryObj<typeof prescriptions>;

export const Basic: Story = {args: {}};
