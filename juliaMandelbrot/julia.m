function julia(c1, c2, m)
    grid on;
    hold on;
    col = 30;
    a = 0;
    b = 0;
    l = 1.5;
    x = linspace(a-l, a+l, m);
    y = linspace(b-l, b+l, m);
    [x, y] = meshgrid(x, y);
    c = c1 + c2*1i;
    z = x + y*1i;
    for k = 1:col;
        z = z.^2 + c;
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