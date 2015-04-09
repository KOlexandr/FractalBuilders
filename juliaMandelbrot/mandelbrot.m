function mandelbrot(zPow)
    col = 20;
    m = 400;
    a = -0.1;
    b = 0;
    l = 1.5;
    x = linspace(a-l, a+l, m);
    y = linspace(b-l, b+l, m);
    [x,y] = meshgrid(x, y);
    z = zeros(m);
    c = x + y*1i;
    for k = 1:col
        z = z.^zPow + c;
        w = exp(-abs(z));
    end
    [height, width] = size(w);
    for k = 1:height
        for j = 1:width
            if(w(k,j) ~= 0)
                w(k, j) = 0;
            else
                w(k, j) = 255;
            end;
        end
    end
    colormap(gray);
    image(w);
    axis('square','equal','off');
end