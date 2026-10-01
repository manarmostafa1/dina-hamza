/* ------------------------------------------------------------------ *
 *  /courses — the page of photos from Dina's classes (CoursesPage.tsx).
 *  Not a project: it has its own page and is not in the project data.
 *
 *  photos  in order; files in public/teaching, lowercase with no spaces
 *          (they are URLs on a case-sensitive host). width / height are
 *          the files' pixel size, so the page doesn't jump as they load.
 *  The count on the page comes from this list.
 * ------------------------------------------------------------------ */
export interface CoursePhoto {
  src: string;
  width: number;
  height: number;
  alt: string;
}

export const coursesPage = {
  eyebrow: "Teaching",
  title: "Drawing & Painting Classes.",
  accent: "Classes",
  lead: "Moments from my drawing and painting classes for children, teens, and adults, working across different skill levels and artistic techniques.",
  cta: "Want to join a class?",
  ctaButton: "Book a class",
};

const photo = (n: number): CoursePhoto => ({
  src: `/teaching/class-0${n}.jpg`,
  width: 960,
  height: 1280,
  alt: `A moment from one of Dina's drawing and painting classes, photo ${n} of 5`,
});

export const coursePhotos: CoursePhoto[] = [1, 2, 3, 4, 5].map(photo);
