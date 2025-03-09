import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { TenantConfig } from '../types/tenant';
import { Button } from './Button';
import { Input } from './Input';
import { Textarea } from './Textarea';
import { ColorPicker } from './ColorPicker';
import { FileUpload } from './FileUpload';
import { Card } from './Card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './Tabs';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const careerPageSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  subtitle: z.string().optional(),
  description: z.string().min(10, 'Description should be at least 10 characters'),
  metaDescription: z.string().optional(),
  features: z.array(z.object({
    title: z.string(),
    description: z.string(),
    icon: z.string().optional()
  })).optional(),
  testimonials: z.array(z.object({
    name: z.string(),
    role: z.string(),
    company: z.string(),
    content: z.string(),
    image: z.string().optional()
  })).optional(),
  teamSection: z.object({
    title: z.string(),
    description: z.string().optional(),
    members: z.array(z.object({
      name: z.string(),
      role: z.string(),
      image: z.string().optional(),
      bio: z.string().optional()
    }))
  }).optional()
});

interface CareerSiteBuilderProps {
  config: TenantConfig;
  onSave: (config: Partial<TenantConfig>) => Promise<void>;
}

export function CareerSiteBuilder({ config, onSave }: CareerSiteBuilderProps) {
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    resolver: zodResolver(careerPageSchema),
    defaultValues: config.careerPage
  });

  const onSubmit = async (data: any) => {
    await onSave({
      careerPage: data
    });
  };

  const handleFeatureDragEnd = (result: any) => {
    if (!result.destination) return;
    
    const features = Array.from(watch('features') || []);
    const [reorderedItem] = features.splice(result.source.index, 1);
    features.splice(result.destination.index, 0, reorderedItem);
    
    setValue('features', features);
  };

  const addFeature = () => {
    const features = watch('features') || [];
    setValue('features', [
      ...features,
      { title: '', description: '', icon: '' }
    ]);
  };

  const addTestimonial = () => {
    const testimonials = watch('testimonials') || [];
    setValue('testimonials', [
      ...testimonials,
      { name: '', role: '', company: '', content: '', image: '' }
    ]);
  };

  const addTeamMember = () => {
    const members = watch('teamSection.members') || [];
    setValue('teamSection.members', [
      ...members,
      { name: '', role: '', image: '', bio: '' }
    ]);
  };

  return (
    <div className="max-w-5xl mx-auto py-8">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <Tabs defaultValue="general" className="w-full">
          <TabsList>
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
            <TabsTrigger value="testimonials">Testimonials</TabsTrigger>
            <TabsTrigger value="team">Team</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-medium mb-4">Career Page Settings</h3>
              <div className="space-y-4">
                <div>
                  <Input
                    label="Page Title"
                    {...register('title')}
                    error={errors.title?.message}
                  />
                </div>
                <div>
                  <Input
                    label="Subtitle"
                    {...register('subtitle')}
                    error={errors.subtitle?.message}
                  />
                </div>
                <div>
                  <Textarea
                    label="Description"
                    {...register('description')}
                    error={errors.description?.message}
                  />
                </div>
                <div>
                  <Textarea
                    label="Meta Description"
                    {...register('metaDescription')}
                    error={errors.metaDescription?.message}
                    helperText="Used for SEO purposes"
                  />
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="features" className="space-y-6">
            <Card className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Features Section</h3>
                <Button type="button" onClick={addFeature}>Add Feature</Button>
              </div>
              
              <DragDropContext onDragEnd={handleFeatureDragEnd}>
                <Droppable droppableId="features">
                  {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
                      {watch('features')?.map((_, index) => (
                        <Draggable key={index} draggableId={`feature-${index}`} index={index}>
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="border rounded-lg p-4"
                            >
                              <Input
                                label="Feature Title"
                                {...register(`features.${index}.title`)}
                                error={errors.features?.[index]?.title?.message}
                              />
                              <Textarea
                                label="Feature Description"
                                {...register(`features.${index}.description`)}
                                error={errors.features?.[index]?.description?.message}
                                className="mt-4"
                              />
                              <Input
                                label="Icon"
                                {...register(`features.${index}.icon`)}
                                error={errors.features?.[index]?.icon?.message}
                                className="mt-4"
                              />
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            </Card>
          </TabsContent>

          <TabsContent value="testimonials" className="space-y-6">
            <Card className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Testimonials</h3>
                <Button type="button" onClick={addTestimonial}>Add Testimonial</Button>
              </div>
              
              <div className="space-y-6">
                {watch('testimonials')?.map((_, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        label="Name"
                        {...register(`testimonials.${index}.name`)}
                        error={errors.testimonials?.[index]?.name?.message}
                      />
                      <Input
                        label="Role"
                        {...register(`testimonials.${index}.role`)}
                        error={errors.testimonials?.[index]?.role?.message}
                      />
                      <Input
                        label="Company"
                        {...register(`testimonials.${index}.company`)}
                        error={errors.testimonials?.[index]?.company?.message}
                      />
                      <FileUpload
                        label="Photo"
                        {...register(`testimonials.${index}.image`)}
                        error={errors.testimonials?.[index]?.image?.message}
                      />
                    </div>
                    <Textarea
                      label="Testimonial"
                      {...register(`testimonials.${index}.content`)}
                      error={errors.testimonials?.[index]?.content?.message}
                      className="mt-4"
                    />
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="team" className="space-y-6">
            <Card className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Team Section</h3>
                <Button type="button" onClick={addTeamMember}>Add Team Member</Button>
              </div>

              <div className="space-y-4 mb-6">
                <Input
                  label="Section Title"
                  {...register('teamSection.title')}
                  error={errors.teamSection?.title?.message}
                />
                <Textarea
                  label="Section Description"
                  {...register('teamSection.description')}
                  error={errors.teamSection?.description?.message}
                />
              </div>
              
              <div className="space-y-6">
                {watch('teamSection.members')?.map((_, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        label="Name"
                        {...register(`teamSection.members.${index}.name`)}
                        error={errors.teamSection?.members?.[index]?.name?.message}
                      />
                      <Input
                        label="Role"
                        {...register(`teamSection.members.${index}.role`)}
                        error={errors.teamSection?.members?.[index]?.role?.message}
                      />
                      <FileUpload
                        label="Photo"
                        {...register(`teamSection.members.${index}.image`)}
                        error={errors.teamSection?.members?.[index]?.image?.message}
                      />
                    </div>
                    <Textarea
                      label="Bio"
                      {...register(`teamSection.members.${index}.bio`)}
                      error={errors.teamSection?.members?.[index]?.bio?.message}
                      className="mt-4"
                    />
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end">
          <Button type="submit">Save Changes</Button>
        </div>
      </form>
    </div>
  );
}