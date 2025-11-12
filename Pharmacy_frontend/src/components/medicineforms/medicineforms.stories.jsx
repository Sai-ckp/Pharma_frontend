import React from 'react';
import type {Meta, StoryObj} from '@storybook/react';

import {medicineforms} from './medicineforms';

const meta: Meta<typeof medicineforms> = {
  component: medicineforms,
};

export default meta;

type Story = StoryObj<typeof medicineforms>;

export const Basic: Story = {args: {}};
