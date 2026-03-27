"use client"

import React from 'react'
import { useForm } from 'react-hook-form'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/app/components/ui/dialog'
import { Form, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/app/components/ui/form'
import { Input } from '@/app/components/ui/input'
import { Button } from '@/app/components/ui/button'
import { Alert, AlertDescription } from '@/app/components/ui/alert'

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  initial?: any
  onSubmit: (values: any) => Promise<void>
}

export function ProductForm({ open, onOpenChange, initial, onSubmit }: Props) {
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  
  const form = useForm({
    defaultValues: {
      name: initial?.name || initial?.title || '',
      price: initial?.price || 0,
      category: initial?.category || '',
      description: initial?.description || '',
      language: initial?.techSpecs?.language || '',
    },
  })
  const fileRef = React.useRef<HTMLInputElement | null>(null)

  const submit = form.handleSubmit(async (values) => {
    setError(null)
    setIsLoading(true)
    try {
      console.log('📝 ProductForm: Starting submission with values:', values)
      
      // build FormData to include file upload
      const formData = new FormData()
      formData.append('name', values.name)
      formData.append('price', String(Number(values.price) || 0))
      formData.append('category', values.category || '')
      formData.append('description', values.description || '')
      formData.append('techSpecs', JSON.stringify({ language: values.language || '' }))
      
      const file = fileRef.current?.files?.[0]
      if (file) {
        console.log('📷 File selected:', file.name, file.size, file.type)
        formData.append('image', file)
      } else {
        console.log('⚠️ No image file selected')
      }

      console.log('✅ ProductForm: Calling onSubmit with FormData')
      await onSubmit(formData)
      
      console.log('✅ ProductForm: Submission successful, resetting form')
      form.reset()
      if (fileRef.current) fileRef.current.value = ''
      onOpenChange(false)
      setIsLoading(false)
    } catch (error) {
      setIsLoading(false)
      const errorMsg = error instanceof Error ? error.message : String(error)
      console.error('❌ ProductForm: Error during submission:', errorMsg)
      setError(errorMsg)
    }
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{initial ? 'Edit Product' : 'Add Product'}</DialogTitle>
        </DialogHeader>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Form {...form}>
          <form onSubmit={submit} className="grid gap-4">
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...form.register('name', { required: 'Name is required' })} disabled={isLoading} />
              </FormControl>
              <FormMessage />
            </FormItem>

            <div className="grid grid-cols-2 gap-4">
              <FormItem>
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <Input type="number" {...form.register('price')} disabled={isLoading} />
                </FormControl>
                <FormMessage />
              </FormItem>
              <div />
            </div>

            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input {...form.register('description')} disabled={isLoading} />
              </FormControl>
              <FormMessage />
            </FormItem>

            <div className="grid grid-cols-2 gap-4">
              <FormItem>
                <FormLabel>Image</FormLabel>
                <FormControl>
                  <input type="file" ref={fileRef} accept="image/*" disabled={isLoading} className="block w-full text-sm text-gray-700" />
                </FormControl>
                <FormMessage />
              </FormItem>

              <FormItem>
                <FormLabel>Category</FormLabel>
                <FormControl>
                  <select {...form.register('category')} disabled={isLoading} className="w-full border rounded px-2 py-1 disabled:opacity-50 disabled:cursor-not-allowed">
                    <option value="">Select category</option>
                    <option value="Web">Web</option>
                    <option value="Android">Android</option>
                    <option value="Machine Learning">Machine Learning</option>
                    <option value="UI/UX">UI/UX</option>
                    <option value="Data Science">Data Science</option>
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            </div>

            <FormItem>
              <FormLabel>Language</FormLabel>
              <FormControl>
                <Input {...form.register('language')} disabled={isLoading} />
              </FormControl>
              <FormMessage />
            </FormItem>

            <DialogFooter className="gap-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
                Cancel
              </Button>
              <Button type="submit" className="bg-[#4FC3F7] hover:bg-[#87CEEB] text-white disabled:opacity-50 disabled:cursor-not-allowed" disabled={isLoading}>
                {isLoading ? 'Saving...' : 'Save Product'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default ProductForm
