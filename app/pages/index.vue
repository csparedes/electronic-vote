<template>
  <div class="space-y-16 py-12">
    <div class="text-center space-y-4">
      <h1 class="text-4xl font-bold text-primary">
        Electronic Vote
      </h1>
      <p class="text-lg text-muted max-w-2xl mx-auto">
        Make your votes electronic and safe. Participate in elections from anywhere, anytime.
      </p>
      <div class="flex gap-4 justify-center pt-4">
        <UButton
          to="/auth?tab=login"
          size="lg"
          icon="i-lucide-vote"
        >
          Vote Now
        </UButton>
        <UButton
          to="/auth?tab=register"
          size="lg"
          variant="outline"
          icon="i-lucide-user-plus"
        >
          Register
        </UButton>
      </div>
    </div>

    <div class="grid md:grid-cols-3 gap-6">
      <UCard
        v-for="feature in features"
        :key="feature.title"
      >
        <template #header>
          <div class="flex items-center gap-3">
            <UIcon
              :name="feature.icon"
              class="w-6 h-6 text-primary"
            />
            <h3>
              {{ feature.title }}
            </h3>
          </div>
        </template>
        <p>
          {{ feature.description }}
        </p>
      </UCard>
    </div>

    <div class="bg-primary/5 rounded-lg p-8 text-center">
      <h2>
        Ready to participate?
      </h2>
      <p class="text-muted mb-4">
        Join thousands of voters in secure electronic elections.
      </p>
      <UButton
        to="/auth"
        size="lg"
      >
        Get Started
      </UButton>
    </div>
  </div>
</template>

<script lang="ts" setup>
definePageMeta({
  layout: 'default'
})

const features = [
  {
    title: 'Secure Voting',
    description: 'End-to-end encryption ensures your vote remains private and tamper-proof.',
    icon: 'i-lucide-shield-check'
  },
  {
    title: 'Real-time Results',
    description: 'See election results update in real-time as votes are cast.',
    icon: 'i-lucide-bar-chart-3'
  },
  {
    title: 'Easy Access',
    description: 'Vote from any device, anywhere in the world with internet access.',
    icon: 'i-lucide-globe'
  }
]
</script>
